
setTimeout(() => {
$(document).ready(function() {
    let filterTab = $('.filter__tab')
    let filterSeasons = $('.filter__seasons')

    filterTab.on('click', function (e) {
        e.preventDefault()
        if (!$(this).hasClass('filter__tab_active')) {
            filterTab.removeClass('filter__tab_active')
            $(this).addClass('filter__tab_active')
            $('.filter__tab-cursor').toggleClass('filter__tab-cursor_wheels')
            $('.filter__tab-cursor').toggleClass('filter__tab-cursor_tyres')

            $('.filter__sub-tab').removeClass('filter__sub-tab_active')
            $(`.filter__sub-tab.params`).addClass('filter__sub-tab_active')
            $('.filter__body .row').removeClass('active')
            if ($(this).text() == 'Диски') {
                filterType = 'wheels'
                $('.filter__body .row.wheels').addClass('active')
            }
            else {
                filterType = 'tyres'
                $('.filter__body .row.tyres').addClass('active')
            }
            history.replaceState(null, null,  `/sibirkoleso/${filterType}.html`)
            window.location.reload()
        }
    })

    let filterSubTab = $('.filter__sub-tab')
    let sort = $('.sort')

    filterSubTab.on('click', function () {
        filterSubTab.removeClass('filter__sub-tab_active')
        $(this).toggleClass('filter__sub-tab_active')

        let type = $(this).attr("class").split(/\s+/)[1]


        $('.row').removeClass('active')
        if (type == 'cars') {
            $('.row.' + type).addClass('active')
            sort.css('display', 'block')
        } else {
            $('.row.' + type + '.' + filterType).addClass('active')
            sort.css('display', 'none')
        }
    })

   var filterTitle = $('.filter__type-title')

    filterTitle.on('click', function () {
        $('.filter__type-list').toggleClass('open')
    })

    $('.filter__type-list label').on('click', function() {
        filterTitle.html(
            $(this).text() +
            "<img alt=\"\" class=\"filter__type-img\" src=\"img/arrow.svg\">"
        )
        if(filterTitle.text() != 'Легковые авто') {
            filterSeasons.find(".row").removeClass('active')
            filterSeasons.css('display', 'none')
        } else {
            filterSeasons.find(".row").addClass('active')
            $('.filter__type-list input').removeAttr('checked')
            filterSeasons.css('display', 'block')
            $('.filter__type-list').removeClass('open')
        }
    })

    let thorn = $('.thorn')

    $('.filter__seasons-item').on('click', function () {
        if ($(this).hasClass('winter') || $('.winter input').is(':checked')) {
            thorn.css('display', 'inline-block')
        } else {
            thorn.css('display', 'none')
            thorn.find('input').prop('checked', false)
        }
    })

    $('.filter__item-title').on('click', function () {
        $(this).parents(".filter__item").toggleClass('activated')
    })

    for (let i = 1; i < 4; i++) {
        $(`.cars-${i} label`).on('click', function () {
            $(`.cars-${i+1}`).removeClass('disabled')
        })
    }

    let catalogSortItem = $('.catalog__sort-item a')

    catalogSortItem.on('click', function (e) {
        e.preventDefault()

        if ($(this).hasClass('active')) {
            let catalogIcon = $('.catalog__icon')
            catalogIcon.toggleClass("desc")
            catalogIcon.toggleClass("asc")

            let order = catalogIcon.attr("class").split(/\s+/)[1]

            // $.ajax({
            //     url: "/sibirkoleso/data.json",
            //     data: {"order" : order}
            //     success: (data) => {
            //
            //      }
            // })

            switch (order) {
                case 'asc':
                    catalogIcon.html('<path d="M173,169v-1h4v1h-4Zm-4-5h8v1h-8v-1Zm-4-4h12v1H165v-1Z" transform="translate(-165 -160)"/>')
                    break
                case 'desc':
                    catalogIcon.html('<path d="M190,169v-1h12v1H190Zm4-5h8v1h-8v-1Zm4-4h4v1h-4v-1Z" transform="translate(-190 -160)"/>')
                    break
            }
        } else {
            catalogSortItem.removeClass('active')
            $(this).addClass('active')
        }
    })

    let faderSideBar = $('.fader_sidebar')
    let faderMenu = $('.fader_menu')
    let body = $('body')
    let sideBar = $('.sidebar')
    let sideBarSub = $('.sidebar__sub')
    let menuPopUp = $('.main-menu-popup')

    $('.header__cart').on('click', function () {
        body.toggleClass('noscroll')
        faderSideBar.toggleClass('show')
        sideBar.toggleClass('open')
    })

    $('.wild').on('click', function () {
        sideBarSub.toggleClass('open')
    })

    sideBarSub.find('.close').on('click', function () {
        sideBarSub.toggleClass('open')
    })

    $('.cart__close').on('click', function () {
        body.toggleClass('noscroll')
        faderSideBar.toggleClass('show')
        sideBar.toggleClass('open')
    })

    $('.header__menu-button').on('click', function () {
        menuPopUp.toggleClass('open')
        faderMenu.toggleClass('show')
        $(this).toggleClass('open')
    })

    faderSideBar.on('click', function () {
        body.removeClass('noscroll')
        sideBar.removeClass('open')
        sideBarSub.removeClass('open')
        $(this).removeClass('show')
    })

    faderMenu.on('click', function () {
        menuPopUp.removeClass('open')
        $('.header__menu-button').removeClass('open')
        $(this).removeClass('show')
    })
})
}, 100)

