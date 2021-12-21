import{b as C}from"./chunk-KEDQIPDM.js";import{b as k}from"./chunk-UOJKSOAD.js";import{a as s}from"./chunk-WX2YIHWY.js";import"./chunk-U3UMSI2M.js";var g=document.getElementById("udesly-wc-mini-cart-elements"),u=JSON.parse(g.textContent),f,y=k()({state:{count:u.count||0,subtotal:u.subtotal||"",total:u.total||"",items:u.items||[],notices:u.notices||[],cartOpen:!1,checkout:u.checkout||{}},reducers:{toggleCart(e){return{...e,cartOpen:!e.cartOpen}},setCartOpen(e,o){return{...e,cartOpen:o}},cartChanged(e){let o=document.getElementById("udesly-wc-mini-cart-elements"),m=JSON.parse(o.textContent);return{...e,...m}},removedFromCart(e,o){return s("removed_from_cart",[o.fragments,o.cart_hash]),s("update_checkout"),e},ajaxError(e,o){return console.error(o),e},addedToCart(e,o){return s("added_to_cart",[o.fragments,o.cart_hash]),s("update_checkout"),e},appliedCoupon(e,o){if(s("applied_coupon_in_checkout",[o.coupon_code]),s("update_checkout",{update_shipping_method:!1}),e.checkout.coupons||(e.checkout.coupons=[]),e.checkout.coupons.push(o),e.checkout.coupons.length>0){let m=document.querySelector(".w-commerce-commercecheckoutordersummarywrapper");m&&m.scrollIntoView({behavior:"smooth",block:"center"})}return{...e}},updateCheckout(e){return document.body.classList.add("updating-checkout"),e},checkoutUpdated(e){return document.body.classList.remove("updating-checkout"),e},updatedCartQuantity(e,o){return s("added_to_cart",[o.fragments,o.cart_hash]),s("update_checkout"),e},checkoutNotice(e,o){return e},invalidCoupon(e,o){return console.log(o),e.checkout.coupons=[],{...e}}},effects:e=>({async removeFromCart(o,m){let c=new FormData;c.set("cart_item_key",o);let t=await fetch(window.udesly_frontend_options.wc.wc_ajax_url.replace("%%endpoint%%","remove_from_cart"),{method:"POST",body:c});if(t.ok){let r=await t.json();r.success&&r.success===!1?e.woocommerce.ajaxError(t.status):e.woocommerce.removedFromCart(r)}else e.woocommerce.ajaxError(t.status)},async applyCoupon(o,m){jQuery&&jQuery(".woocommerce-error, .woocommerce-message").remove();let c=new FormData;c.set("security",wc_checkout_params.apply_coupon_nonce),c.set("coupon_code",o.coupon_code);let t=await fetch(wc_checkout_params.wc_ajax_url.replace("%%endpoint%%","apply_coupon"),{method:"POST",body:c});if(t.ok){let r=await t.text();e.woocommerce.checkoutNotice(r),s("update_checkout",{update_shipping_method:!1}),e.woocommerce.appliedCoupon({coupon_code:o.coupon_code,resp:r})}else e.woocommerce.ajaxError(t.status)},async updateCartQuantity(o,m){let c=new FormData;c.set("key",o.key),c.set("quantity",o.quantity);let t=await fetch(window.udesly_frontend_options.wc.wc_ajax_url.replace("%%endpoint%%","udesly_change_cart_quantity"),{method:"POST",body:c});if(t.ok){let r=await t.json();r.success&&r.success===!1?e.woocommerce.ajaxError(t.status):e.woocommerce.removedFromCart(r)}else e.woocommerce.ajaxError(t.status)},async addToCart(o,m){let{type:c,variation_id:t,product_id:r,quantity:w,el:d,submitter:a,buyNow:h,...i}=o;if(f&&clearTimeout(f),d.parentElement.querySelectorAll(".w-commerce-commerceaddtocarterror").forEach(n=>n.style.display="none"),d.parentElement.classList.add("adding-to-cart"),a.disabled)return;a.tagName=="BUTTON"&&(a.dataset.default||(a.dataset.default=a.textContent),a.textContent=a.dataset.loadingText,a.disabled=!0),c=="variable"&&t!=="0"&&(r=t);let p=new FormData;if(w||w==1,p.set("quantity",w),p.set("product_id",r),i&&Object.keys(i).length)for(let n in i)p.set(n,i[n]);let _=await fetch(window.udesly_frontend_options.wc.wc_ajax_url.replace("%%endpoint%%","udesly_add_to_cart"),{method:"POST",body:p});if(_.ok){let n=await _.json();n.error&&n.error===!0?(e.woocommerce.ajaxError(n.error_message||n),d.parentElement.querySelectorAll('[data-node-type="commerce-add-to-cart-error"]').forEach(l=>l.innerHTML=n.error_message),d.parentElement.querySelectorAll(".w-commerce-commerceaddtocarterror").forEach(l=>l.style.display=""),f=setTimeout(()=>{d.parentElement.querySelectorAll(".w-commerce-commerceaddtocarterror").forEach(l=>l.style.display="none")},1e4)):h?window.location=window.udesly_frontend_options.wc.checkout_url:e.woocommerce.addedToCart(n)}else e.woocommerce.ajaxError(_.status);d.parentElement.classList.remove("adding-to-cart"),a.tagName=="BUTTON"&&(a.textContent=a.dataset.default,a.disabled=!1)}})});var q={woocommerce:y,wordpress:C};export{q as models};
