import{b as g}from"./chunk-4M6HHUJ2.js";import{b as h}from"./chunk-UOJKSOAD.js";import{a as s}from"./chunk-WX2YIHWY.js";import"./chunk-U3UMSI2M.js";var k=document.getElementById("udesly-wc-mini-cart-elements"),u=JSON.parse(k.textContent),w,_=h()({state:{count:u.count||0,subtotal:u.subtotal||"",total:u.total||"",items:u.items||[],notices:u.notices||[],cartOpen:!1,checkout:u.checkout||{}},reducers:{toggleCart(e){return{...e,cartOpen:!e.cartOpen}},cartChanged(e){let o=document.getElementById("udesly-wc-mini-cart-elements"),n=JSON.parse(o.textContent);return{...e,...n}},removedFromCart(e,o){return s("removed_from_cart",[o.fragments,o.cart_hash]),s("update_checkout"),e},ajaxError(e,o){return console.error(o),e},addedToCart(e,o){return s("added_to_cart",[o.fragments,o.cart_hash]),s("update_checkout"),e},appliedCoupon(e,o){if(s("applied_coupon_in_checkout",[o.coupon_code]),s("update_checkout",{update_shipping_method:!1}),e.checkout.coupons||(e.checkout.coupons=[]),e.checkout.coupons.push(o),e.checkout.coupons.length>0){let n=document.querySelector(".w-commerce-commercecheckoutordersummarywrapper");n&&n.scrollIntoView({behavior:"smooth",block:"center"})}return{...e}},updateCheckout(e){return document.body.classList.add("updating-checkout"),e},checkoutUpdated(e){return document.body.classList.remove("updating-checkout"),e},updatedCartQuantity(e,o){return s("added_to_cart",[o.fragments,o.cart_hash]),s("update_checkout"),e},checkoutNotice(e,o){return e},invalidCoupon(e,o){return console.log(o),e.checkout.coupons=[],{...e}}},effects:e=>({async removeFromCart(o,n){let c=new FormData;c.set("cart_item_key",o);let t=await fetch(window.udesly_frontend_options.wc.wc_ajax_url.replace("%%endpoint%%","remove_from_cart"),{method:"POST",body:c});if(t.ok){let r=await t.json();r.success&&r.success===!1?e.woocommerce.ajaxError(t.status):e.woocommerce.removedFromCart(r)}else e.woocommerce.ajaxError(t.status)},async applyCoupon(o,n){jQuery&&jQuery(".woocommerce-error, .woocommerce-message").remove();let c=new FormData;c.set("security",wc_checkout_params.apply_coupon_nonce),c.set("coupon_code",o.coupon_code);let t=await fetch(wc_checkout_params.wc_ajax_url.replace("%%endpoint%%","apply_coupon"),{method:"POST",body:c});if(t.ok){let r=await t.text();e.woocommerce.checkoutNotice(r),s("update_checkout",{update_shipping_method:!1}),e.woocommerce.appliedCoupon({coupon_code:o.coupon_code,resp:r})}else e.woocommerce.ajaxError(t.status)},async updateCartQuantity(o,n){let c=new FormData;c.set("key",o.key),c.set("quantity",o.quantity);let t=await fetch(window.udesly_frontend_options.wc.wc_ajax_url.replace("%%endpoint%%","udesly_change_cart_quantity"),{method:"POST",body:c});if(t.ok){let r=await t.json();r.success&&r.success===!1?e.woocommerce.ajaxError(t.status):e.woocommerce.removedFromCart(r)}else e.woocommerce.ajaxError(t.status)},async addToCart(o,n){let{type:c,variation_id:t,product_id:r,quantity:f,el:d,submitter:a,buyNow:y}=o;if(w&&clearTimeout(w),d.parentElement.querySelectorAll(".w-commerce-commerceaddtocarterror").forEach(m=>m.style.display="none"),d.parentElement.classList.add("adding-to-cart"),a.disabled)return;a.tagName=="BUTTON"&&(a.dataset.default||(a.dataset.default=a.textContent),a.textContent=a.dataset.loadingText,a.disabled=!0),c=="variable"&&t!=="0"&&(r=t);let i=new FormData;i.set("quantity",f),i.set("product_id",r);let p=await fetch(window.udesly_frontend_options.wc.wc_ajax_url.replace("%%endpoint%%","udesly_add_to_cart"),{method:"POST",body:i});if(p.ok){let m=await p.json();m.error&&m.error===!0?(e.woocommerce.ajaxError(m.error_message||m),d.parentElement.querySelectorAll('[data-node-type="commerce-add-to-cart-error"]').forEach(l=>l.innerHTML=m.error_message),d.parentElement.querySelectorAll(".w-commerce-commerceaddtocarterror").forEach(l=>l.style.display=""),w=setTimeout(()=>{d.parentElement.querySelectorAll(".w-commerce-commerceaddtocarterror").forEach(l=>l.style.display="none")},1e4)):y?window.location=window.udesly_frontend_options.wc.checkout_url:e.woocommerce.addedToCart(m)}else e.woocommerce.ajaxError(p.status);d.parentElement.classList.remove("adding-to-cart"),a.tagName=="BUTTON"&&(a.textContent=a.dataset.default,a.disabled=!1)}})});var O={woocommerce:_,wordpress:g};export{O as models};
