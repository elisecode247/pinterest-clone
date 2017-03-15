var nav = $('.nav--logged-in');
var menu = $('.hamburger-menu');
var picForm = $('.pic-form');
var addPicMenu = $('.nav__a--addpic');

var toggleMenu = function (event) {
    nav.toggleClass('nav--closed');
}

var closeNav = function () {
    if ($(document).width() >= 540) {
        nav.removeClass('nav--closed');
    } else {
        nav.addClass('nav--closed');
    }
}

var toggleForm = function (event) {
    picForm.toggleClass('form--hidden');
}

$(window).resize(closeNav);

menu.click(toggleMenu);

addPicMenu.click(toggleForm);

$(document).ready(closeNav);