<script setup>
import { ref } from 'vue';

let jolder = ref({
    jljiu: {
        type: 'folder',
        children: {
            '编程': {
                type: 'folder',
                children: {
                    js: {
                        type: 'item',
                        value: 'node.js'
                    }
                }
            },
            '绘画': {
                type: 'folder',
                children: {
                    '参考': {
                        type: 'item',
                        value: 'pixiv.com'
                    }
                }
            }
        }
    }
})
</script>
<template>
    <div class="card">
        <p class="plan-name">Life-time license</p>
        <p class="price">
            <!--!--><del>$120</del> $69
        </p>
        <p>One-time payment.</p>
        <!--!-->
        <p class="save-badge" style="margin-bottom: 0;">🎁 Save 43% - Halloween Deal - only until October 31st</p>
        <div>
            <a href="https://toastlog.com" target="_blank" class="toast-offer">🍞 Bonus: Buy CSS Scan now and you get
                50% OFF on <span>toast.log</span>!</a>
        </div>
        <br>
        <a href="https://gum.co/cssscan" data-gumroad-single-product="true"
            class="button second-buy-button button-principal" target="_blank" rel="noopener noreferrer"
            style="margin-top: 2em;">
            <svg class="svg-inline--fa fa-shopping-cart fa-w-18" aria-hidden="true" focusable="false" data-prefix="fas"
                data-icon="shopping-cart" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"
                data-fa-i2svg="">
                <path fill="currentColor"
                    d="M528.12 301.319l47.273-208C578.806 78.301 567.391 64 551.99 64H159.208l-9.166-44.81C147.758 8.021 137.93 0 126.529 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24h69.883l70.248 343.435C147.325 417.1 136 435.222 136 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-15.674-6.447-29.835-16.824-40h209.647C430.447 426.165 424 440.326 424 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-22.172-12.888-41.332-31.579-50.405l5.517-24.276c3.413-15.018-8.002-29.319-23.403-29.319H218.117l-6.545-32h293.145c11.206 0 20.92-7.754 23.403-18.681z">
                </path>
            </svg><!-- <i class="fas fa-shopping-cart"></i> -->Get it now
        </a>
    </div>
</template>
<style>
/* body {
    background: #eee;
} */


.svg-inline--fa {
    display: inline-block;
    font-size: inherit;
    height: 1em;
    overflow: visible;
    vertical-align: -0.125em;
}

.plan-name,
.price {
    font-family: CerebriSans-Bold, -apple-system, BlinkMacSystemFont, Roboto,
        sans-serif;
    font-weight: 400;
}

.button {
    border-radius: 50px;
    box-shadow: rgba(0, 12, 32, 0.04) 0 0 1px 0, rgba(10, 31, 68, 0.1) 0 3px 4px 0;
    display: inline-block;
    height: 50px;
    line-height: 50px;
    margin-top: 0.7em;
    padding: 0 25px;
    text-decoration: none;
    transition: all 250ms ease-in-out;
    will-change: transform;
}

.button-principal {
    background-color: #2cbc63;
    border-style: none;
    color: #000;
    margin-left: 0;
}

.button-principal * {
    pointer-events: none;
}

.price {
    color: #333;
    font-size: 3em;
    margin: 0 0 0.15em;
}

.plan-name {
    font-size: 1.1em;
    margin-bottom: 1em;
}

.save-badge,
.toast-offer {
    border-radius: 16px;
    box-sizing: border-box;
    display: inline-block;
    font-size: 13px;
    padding: 0 10px;
    vertical-align: middle;
}

.save-badge {
    background-color: #ddf8e7;
    color: green;
    cursor: default;
    font-weight: 500;
}

.toast-offer {
    background-color: #fef1bd;
    color: #000;
    margin-top: 1.5em;
    text-decoration: none;
}

.button svg {
    margin-right: 0.5em;
}

.price del {
    color: #2cbc63;
    vertical-align: middle;
}

span {
    font-size: 0.9em;
}

.svg-inline--fa.fa-w-18 {
    width: 1.125em;
}

.button:hover {
    transform: scale(1.05);
}

svg:not(:root).svg-inline--fa {
    overflow: visible;
}

.toast-offer span {
    color: #000;
}

.card {
    background-color: #fff !important;
    border-radius: 7px !important;
    box-shadow: rgba(0, 0, 0, 0.1) 0 1px 2px 0 !important;
    box-sizing: border-box !important;
    color: #333 !important;
    font-family: CerebriSans-Regular, -apple-system, BlinkMacSystemFont, Roboto,
        sans-serif !important;
    font-size: 100% !important;
    margin: 2em 0 0 !important;
    padding: 30px !important;
    text-align: initial !important;
    transition: all 350ms ease 0s !important;
}

@media screen and (min-width: 1024px) {
    .card {
        margin-left: 10% !important;
        margin-right: 10% !important;
    }
}

.card:hover {
    box-shadow: rgba(56, 60, 67, 0.07) 0 0 0 1px,
        rgba(56, 60, 67, 0.15) 0 8px 14px 1px !important;
}
</style>