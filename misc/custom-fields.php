<?php

defined( 'ABSPATH' ) || exit;

/**
 *  Functions to define custom fields
 */
if ( ! function_exists( 'udesly_register_custom_fields_for_post_type' ) ) {


	function udesly_register_custom_fields_for_post_type( string $post_type, array $fields = [] ) {


		acf_add_local_field_group( [
			"key"      => "udesly_group_$post_type",
			"title"    => __( "Collection Fields" ),
			"fields"   => $fields,
			'location' => [
				[
					[
						'param'    => 'post_type',
						'operator' => '==',
						'value'    => $post_type,
					],
				],
			],
		] );

	}

}

if ( ! function_exists( 'udesly_register_custom_fields_for_taxonomy' ) ) {


	function udesly_register_custom_fields_for_taxonomy( string $taxonomy, array $fields = [] ) {


		acf_add_local_field_group( [
			"key"      => "udesly_group_$taxonomy",
			"title"    => __( "Taxonomy Fields" ),
			"fields"   => $fields,
			"location" => [
				[
					[
						"param"    => "taxonomy",
						"operator" => "==",
						"value"    => $taxonomy
					]
				]
			]
		] );

		/*Container::make('term_meta', __('Collection Fields'))
		         ->where('term_taxonomy', '=', $taxonomy)
		         ->add_fields(
			         $fields
		         );*/
	}

}

if ( ! function_exists( 'udesly_register_custom_fields_for_user' ) ) {


	function udesly_register_custom_fields_for_user( array $fields = [] ) {


		acf_add_local_field_group( [
			"key"      => "udesly_group_users",
			"title"    => __( "User Fields" ),
			"fields"   => $fields,
			"location" => [
				[
					[
						'param'    => 'user_form',
						'operator' => '==',
						'value'    => 'all',
					]
				]
			]
		] );

	}

}

if ( ! function_exists( 'udesly_custom_field_generics' ) ) {

	function udesly_custom_field_generics( array $args, string $type ) {
		return array_merge( $args, [
			"key"  => "field_" . $args['name'],
			"type" => $type
		] );
	}
}

if ( ! function_exists( 'udesly_custom_field_checkbox' ) ) {

	function udesly_custom_field_checkbox( array $args ): array {

		return udesly_custom_field_generics( $args, "true_false" );

	}
}


if ( ! function_exists( 'udesly_custom_field_text' ) ) {

	function udesly_custom_field_text( array $args ): array {

		return udesly_custom_field_generics( $args, $args["type"] ?? "text" );
	}
}

if ( ! function_exists( 'udesly_custom_field_textarea' ) ) {

	function udesly_custom_field_textarea( array $args ) {

		$args = wp_parse_args( $args, [
			"rows" => 5
		] );

		return udesly_custom_field_generics( $args, "textarea" );

	}
}

if ( ! function_exists( 'udesly_custom_field_rich_text' ) ) {

	function udesly_custom_field_rich_text( array $args ): array {

		return udesly_custom_field_generics( $args, "wysiwyg" );

	}
}

if ( ! function_exists( 'udesly_custom_field_color' ) ) {

	function udesly_custom_field_color( array $args ): array {

		return udesly_custom_field_generics( $args, "color_picker" );

	}
}

if ( ! function_exists( 'udesly_custom_field_date' ) ) {

	function udesly_custom_field_date( array $args ): array {

		$args["display_format"] = "Y-m-d H:i:s";
		$args["return_format"]  = "Y-m-d H:i:s";
		$args["first_day"]      = 1;

		return udesly_custom_field_generics( $args, "date_time_picker" );
	}
}

if ( ! function_exists( 'udesly_custom_field_select' ) ) {

	function udesly_custom_field_select( array $args ): array {

		return udesly_custom_field_generics( $args, "select" );

	}
}

if ( ! function_exists( 'udesly_custom_field_image' ) ) {

	function udesly_custom_field_image( array $args ): array {

		$args["return_format"] = "id";

		return udesly_custom_field_generics( $args, "image" );

	}
}

if ( ! function_exists( 'udesly_custom_field_file' ) ) {

	function udesly_custom_field_file( array $args ): array {

		$args["return_format"] = "id";

		return udesly_custom_field_generics( $args, "file" );

	}
}

if ( ! function_exists( 'udesly_custom_field_video' ) ) {

	function udesly_custom_field_video( array $args ): array {

		return udesly_custom_field_generics( $args, "oembed" );

	}
}

if ( ! function_exists( 'udesly_custom_field_post_relation' ) ) {

	function udesly_custom_field_post_relation( array $args ): array {

		$args["return_format"] = "id";

		return udesly_custom_field_generics( $args, "post_object" );
	}

}

if ( ! function_exists( 'udesly_custom_field_term_relation' ) ) {

	function udesly_custom_field_term_relation( array $args ): array {

		$args["return_format"] = "id";

		return udesly_custom_field_generics( $args, "taxonomy" );
	}

}

if ( ! function_exists( 'udesly_custom_field_user_relation' ) ) {

	function udesly_custom_field_user_relation( array $args ): array {

		$args["return_format"] = "id";

		return udesly_custom_field_generics( $args, "user" );
	}

}

if ( ! function_exists( 'udesly_custom_field_set' ) ) {

	function udesly_custom_field_set( array $args ): array {

		$args = wp_parse_args( $args, [
			"help_text" => "",
			"type"      => "image"
		] );

		return udesly_custom_field_generics( $args, "gallery" );
	}

}

if (!function_exists( '__udesly_prepare_field')) {

	function __udesly_prepare_field( string $field_type, $field_value )  {
		switch ($field_type) {
			case "ImageRef":
				return udesly_get_image([
					"id" => $field_value
				]);
			default:
				return $field_value;
		}
	}

}

if (!function_exists('udesly_check_cache')) {

	function udesly_check_cache( $key ) {
		return wp_cache_get($key, 'udesly_cache');
	}
}

if (!function_exists('udesly_set_cache')) {

	function udesly_set_cache ($key, $value) {
		return wp_cache_set($key, $value, 'udesly_cache');
	}
}

if (!function_exists('__udesly_get_field')) {

	function __udesly_get_field($id, $slug, $field_type, $object_prefix = "") {

		if ($object_prefix !== "") {
			$id = $object_prefix . $id;
		}

		$key = $id . $slug . $field_type;

		$cache = udesly_check_cache( $key );
		if ($cache){
			return $cache;
		}

		$field = get_field( $slug, $id );

		$value = __udesly_prepare_field( $field_type, $field );

		udesly_set_cache($key, $value);

		return $value;

	}

}

if (!function_exists('udesly_get_custom_author_field')) {

	function udesly_get_custom_author_field($author_id, string $slug, string $field_type) {

		return __udesly_get_field($author_id, $slug, $field_type, "user_");
	}

}

if (!function_exists('udesly_get_custom_post_field')) {

	function udesly_get_custom_post_field($post_id, string $slug, string $field_type) {
		return __udesly_get_field($post_id, $slug, $field_type);
	}
}

if (!function_exists('udesly_get_custom_term_field')) {

	function udesly_get_custom_term_field($term_id, string $slug, string $field_type) {
		return __udesly_get_field($term_id, $slug, $field_type, "term_");
	}

}