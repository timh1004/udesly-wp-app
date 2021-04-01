<?php

namespace Udesly\Theme;

use Udesly\Utils\DBUtils;
use Udesly\Utils\FSUtils;
use Udesly\Utils\Notices;
use Udesly\Utils\PathUtils;

defined( 'ABSPATH' ) || exit;

final class Theme {

	private $data_path;

	protected static $_instance = null;

	public static function instance() {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}

		return self::$_instance;
	}

	private function __construct() {
		// Get template directory always returns the parent theme folder even if child theme is active;
		$this->data_path = PathUtils::join( get_template_directory(), "_data", "data.json" );
		//$this->config_path = PathUtils::join( get_template_directory(), "_data", "config.json" );
	}

	public function is_valid(): bool {
		return file_exists( $this->data_path );
	}

	private function is_stale_data(): bool {
		$mtime = FSUtils::mtime( $this->data_path );

		if ($mtime > $this->get_last_import_time()) {
			if ($this->get_last_filesize() !== filesize($this->data_path)) {
				return true;
			}
			if ($this->get_last_file_hash() !== sha1_file($this->data_path)) {
				return true;
			}
		}

		return false;

	}

	private function _import_posts( array $posts, string $type ) {

		switch ($type) {
			case "users":
				foreach ( $posts as $post ) {
					DBUtils::create_user_if_necessary( $post );
				}
				break;
			case "terms":
				foreach ( $posts as $post ) {
					DBUtils::create_term_if_necessary( $post );
				}
				break;
			case "posts":
				foreach ( $posts as $post ) {
					DBUtils::create_post_if_necessary( $post );
				}
				break;
		}

	}

	public function import_data( $type, $start_index = 0, $chunks = 5) {

		$data = FSUtils::get_json_content( $this->data_path );

		switch ($type) {
			case "users":
				$posts = $data->users;
				break;
			case "terms":
				$posts = $data->terms;
				break;
			case "posts":
				$posts = $data->posts;
				break;
		}

		$post_chunks = array_chunk($posts, $chunks);

		if ($post_chunks[$start_index]) {
			$this->_import_posts( $post_chunks[$start_index], $type );
			if (isset($post_chunks[$start_index+1])) {
				$this->set_background_import_status( "pending", $start_index+1, $type, true );
			} else {
				$this->set_background_import_status( "complete", 0, $type, false );
			}
		} else {
			$this->set_background_import_status( "complete", 0, $type, false );
		}
	}

	private function set_bg_message( string $message ) {
		set_transient( 'udesly_bg_message', $message );
	}

	private function get_background_import_status() {
		$status = get_transient( 'udesly_bg_import_status' );

		return $status ? $status : (Object) ['status' => 'idle'];
	}

	private function on_import_end() {
		$this->set_last_import_time();
		$this->set_last_filesize();
		$this->set_last_file_hash();
		$homepage = get_page_by_path("index");
		if ($homepage) {
			update_option( 'page_on_front', $homepage->ID );
			update_option( 'show_on_front', 'page' );
		}
		flush_rewrite_rules(true);
		$this->set_background_import_status("idle");
	}

	private function set_background_import_status( string $status, int $next_index = 0, $import_type = "users", $has_next = true ) {

		$import_types = ["users", "terms", "posts"];

		if ($status == "complete") {
			$key = array_search($import_type, $import_types);

			if (isset($import_types[$key+1])) {
				set_transient( 'udesly_bg_import_status', [
					"status"      => "pending",
					"next_index"  => 0,
					"import_type" => $import_types[$key+1],
					"has_next"    => true,
				] );
				return;
			} else {
				// End of import
				$this->on_import_end();
			}
		}

		set_transient( 'udesly_bg_import_status', [
			"status"      => $status,
			"next_index"  => $next_index,
			"import_type" => $import_type,
			"has_next"    => $has_next,
		] );
	}

	private function schedule_import_data() {
		$import = (object) $this->get_background_import_status();

		switch ( $import->status ) {
			case "idle":
				if ( $this->is_stale_data() ) {
					$this->set_background_import_status( "pending" );
				}
				break;
			case "complete":
				if ( $this->is_stale_data() ) {
					$this->set_background_import_status( "pending" );
				} else {
					$this->set_background_import_status( "idle", 0, "users", false );
				}
				break;
		}

	}

	public function check_data() {
		if ( FSUtils::is_available() ) {
			$this->schedule_import_data();
			add_action('wp_ajax_udesly_import_data', [$this, 'udesly_import_data']);
		} else {
			Notices::enqueue_notice( [
				'message'     => __( 'Cannot work properly, no access to the filesystem, please check server configuration', 'udesly' ),
				'type'        => "error",
				'dismissible' => false
			] );
		}
	}

	public function get_last_import_time(): int {
		return (int) get_transient( '_udesly_last_data_import' );
	}

	public function get_last_filesize() : int {
		return (int) get_transient('_udesly_last_data_file_size');
	}

	public function get_last_file_hash() : string {
		return (string) get_transient('_udesly_last_file_hash');
	}

	public function delete_last_import_transient() {
		delete_transient( '_udesly_last_data_import' );
		delete_transient('_udesly_last_data_file_size');
		delete_transient('_udesly_last_file_hash');
	}

	public function set_last_import_time() {
		set_transient( '_udesly_last_data_import', time() );
	}

	public function set_last_filesize() {
		set_transient( '_udesly_last_data_file_size', filesize( $this->data_path ) );
	}

	public function set_last_file_hash() {
		set_transient( '_udesly_last_file_hash', sha1_file( $this->data_path ) );
	}

	public function udesly_import_data() {
		if (!check_ajax_referer('udesly_import_data', 'nonce', false)) {
			wp_send_json_error("Failed security check");
			die;
		}

		$next_index = intval($_POST['next_index']);

		$type = sanitize_text_field($_POST['import_type']);

		$this->import_data($type, $next_index);

		wp_send_json_success($this->get_background_import_status());

	}

	public function admin_hooks() {

		add_action( 'admin_init', [ $this, 'check_data' ] );

		add_filter( 'heartbeat_received', function (array $response, array $data) {
			if ( empty( $data['udesly_check_data'] ) ) {
				return $response;
			}

			$this->check_data();

			$response['udesly_import_data'] = $this->get_background_import_status();

			return $response;
		}, 10, 2);

		add_action('admin_enqueue_scripts', function () {

			wp_register_script('udesly-theme-admin', UDESLY_PLUGIN_URI . '/assets/admin/js/theme.js', [], UDESLY_PLUGIN_VERSION, true);
			wp_localize_script('udesly-theme-admin', 'udesly_theme_admin', [
				'import_data' => $this->get_background_import_status(),
				'nonce' => wp_create_nonce('udesly_import_data'),
				'action' => 'udesly_import_data'
			]);


			wp_enqueue_script('udesly-theme-admin');

		});

		add_action('wp_ajax_udesly_import_data', [$this, 'udesly_import_data']);



	}

}