import{a as u}from"./chunk-O76OGNBI.js";import{a as n,b as a,c as m}from"./chunk-MQ5M26ZK.js";import{c as h}from"./chunk-U3UMSI2M.js";var o=h(u());o.default.config.autoEscape=!1;var s=class{constructor(t,e){this.udesly=t;this.wrapper=e;this.templateFunction=Function;let r=e.querySelector('script[type="text/x-wf-template"]').textContent;this.templateFunction=o.default.compile(r),this.openOnProductAdded=this.wrapper.hasAttribute("data-open-product"),this.openOnHover=this.wrapper.hasAttribute("data-open-on-hover"),this.emptyState=this.wrapper.querySelector(".w-commerce-commercecartemptystate"),this.itemsState=this.wrapper.querySelector(".w-commerce-commercecartform"),this.itemsList=this.wrapper.querySelector(".w-commerce-commercecartlist"),this.initDomEvents(),this.includeTaxes=window.udesly_frontend_options.wc.show_taxes==="incl",this.initStoreEvents()}initStoreEvents(){this.udesly.on("woocommerce/toggleCart",()=>{window.getComputedStyle(this.wrapper).display!="none"&&this.wrapper.dispatchEvent(new CustomEvent("wf-change-cart-state",{detail:{open:this.udesly.getState().woocommerce.cartOpen}}))}),this.udesly.on("woocommerce/cartChanged",()=>{this.refreshCart()}),this.openOnProductAdded&&this.udesly.on("woocommerce/addedToCart",()=>{this.udesly.dispatch("woocommerce/toggleCart")}),this.refreshCart()}updateCartCount(t){this.wrapper.querySelectorAll(".w-commerce-commercecartopenlinkcount").forEach(e=>{e.textContent=t}),this.wrapper.querySelectorAll("[data-count-hide-rule]").forEach(e=>{e.getAttribute("data-count-hide-rule")==="empty"&&(t===0?e.style.display="none":e.style.display="block")})}refreshCart(){this.wrapper.querySelectorAll(".udy-loading").forEach(i=>i.classList.remove("udy-loading"));let{count:t,items:e,subtotal:r,total:c}=this.udesly.getState().woocommerce;this.updateCartCount(t),this.refreshTotal(this.includeTaxes?c:r),e.length?(this.refreshItems(e),this.emptyState.style.display="none",this.itemsState.style.display=""):(this.emptyState.style.display="",this.itemsState.style.display="none")}refreshItems(t){this.itemsList.innerHTML=t.reduce((e,r)=>(r.rowTotal=this.includeTaxes?r.total:r.subtotal,e+=o.default.render(this.templateFunction,r)),"")}refreshTotal(t){this.wrapper.querySelectorAll(".w-commerce-commercecartordervalue").forEach(e=>{e.innerHTML=t})}initDomEvents(){this.wrapper.addEventListener("wf-change-cart-state",t=>m(t,this.wrapper)),a("commerce-cart-open-link",this.wrapper).forEach(t=>{if(t.addEventListener("click",()=>{this.udesly.dispatch("woocommerce/toggleCart")},!0),this.openOnHover){t.addEventListener("mouseenter",()=>{this.udesly.dispatch("woocommerce/toggleCart")},!0);let e=n("commerce-cart-container",this.wrapper);e&&e.addEventListener("mouseleave",()=>{this.udesly.dispatch("woocommerce/toggleCart")})}}),this.wrapper.addEventListener("submit",t=>{t.preventDefault()}),this.wrapper.addEventListener("change",t=>{if(t.target.matches(".w-commerce-commercecartquantity")){let e=t.target;t.target.closest(".w-commerce-commercecartitem")?.classList.add("udy-loading"),this.wrapper.querySelector(".w-commerce-commercecartordervalue")?.classList.add("udy-loading"),this.udesly.dispatch("woocommerce/updateCartQuantity",{key:e.name,quantity:e.value}),t.preventDefault()}}),a("commerce-cart-close-link",this.wrapper).forEach(t=>{t.addEventListener("click",()=>{this.udesly.dispatch("woocommerce/toggleCart")},!0)}),a("commerce-cart-container-wrapper",this.wrapper).forEach(t=>{t.addEventListener("click",e=>{e.target.matches('[data-node-type="commerce-cart-container"], [data-node-type="commerce-cart-container"] *')||this.udesly.dispatch("woocommerce/toggleCart"),e.target.matches('[data-node-type="cart-remove-link"]')&&(e.target.closest(".w-commerce-commercecartitem")?.classList.add("udy-loading"),this.wrapper.querySelector(".w-commerce-commercecartordervalue")?.classList.add("udy-loading"),this.udesly.dispatch("woocommerce/removeFromCart",e.target.getAttribute("key")),e.preventDefault())},!0)})}},y=s;export{y as default};
