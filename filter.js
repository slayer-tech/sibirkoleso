setTimeout(() => {
    let inputName = new Set()
    let catalogBlock = $('.catalog__block')
    let selector = $('.filter .row:not(.cars) input[type="radio"]:not(:checked)+label, .filter .row:not(.cars) input[type="checkbox"]+label');
    func(selector, inputName, catalogBlock, filterType)
}, 3000)

function func(selector, inputName, catalogBlock, filterType) {
    let filterTitle = $('.filter__type-title')
    let filterSeasons = $('.filter__seasons')

    selector.on('click', function () {
        $('.filter__loading').css('display', 'block')
        $('.catalog__loading').css('display', 'block')


        let inputs
        if (filterType == 'wheels') {
            inputs = {
                "porting": [],
                "diameter": [],
                "width": [],
                "gab": [],
                "dia": [],
                "brand": [],
            }
        }
        else {
            inputs = {
                "width": [],
                "height": [],
                "diameter": [],
                "brand": [],
                "season": [],
                "spike": [],
                "type": []
            }
        }


        setTimeout(async () => {
            catalogBlock.html("")
            await $('.row.active').find('input:checked').each((i, e) => {
                let el = $(e)
                inputs[el.attr("name")].push(el.attr('value'))
            })

            if (filterType != 'wheels') {
                inputs.spike[0] = !!inputs.spike.length;

                if (inputs.type.length == 0) {
                    inputs.type[0] = 1
                }
            }

            if (filterType == 'wheels') {
                $.ajax({
                    url: '/sibirkoleso/wheels.json',
                    success: (data) => {
                        let porting = new Set()
                        let diameter = new Set()
                        let width = new Set()
                        let gab = new Set()
                        let dia = new Set()
                        let brand = new Set()
                        let empty = true
                        let match = true

                        for (let input in inputs) {
                            inputs[input].forEach(() => {
                                empty = false
                            })
                            if (!empty) {
                                break
                            }
                        }

                        if (empty) {
                            $.ajax({
                                url: "/sibirkoleso/porting.json",
                                success: data => {
                                    $(".filter__item-list.porting").html("")
                                    fillFilterItem(data, $('.row.wheels .filter__item-list.porting'), 'porting')
                                }
                            })
                            $.ajax({
                                url: "/sibirkoleso/diameters.json",
                                success: data => {
                                    $(".filter__item-list.diameter").html("")
                                    fillFilterItem(data, $('.row.wheels .filter__item-list.diameter'), 'diameter')
                                }
                            })
                            $.ajax({
                                url: "/sibirkoleso/width-wheel.json",
                                success: data => {
                                    $(".filter__item-list.width").html("")
                                    fillFilterItem(data.sort(), $('.row.wheels .filter__item-list.width'), 'width')
                                }
                            })
                            $.ajax({
                                url: "/sibirkoleso/gab.json",
                                success: data => {
                                    $(".filter__item-list.gab").html("")
                                    fillFilterItem(data, $('.row.wheels .filter__item-list.gab'), 'gab')
                                }
                            })
                            $.ajax({
                                url: "/sibirkoleso/dia.json",
                                success: data => {
                                    $(".filter__item-list.dia").html("")
                                    fillFilterItem(data, $('.row.wheels .filter__item-list.dia'), 'dia')
                                }
                            })
                            $.ajax({
                                url: "/sibirkoleso/brand-wheel.json",
                                success: data => {
                                    $(".filter__item-list.brand").html("")
                                    fillFilterItem(data, $('.row.wheels .filter__item-list.brand'), 'brand')
                                }
                            })

                            $('.filter__loading').css('display', 'none')
                            data.forEach(d => {
                                fillCatalog(d)
                            })
                            inputName.clear()
                        }
                        catalogBlock.html("")

                        data.forEach(d => {
                            for (let input in inputs) {
                                if (match) {
                                    for (let val in inputs[input]) {
                                        if (d[input] == inputs[input][val]) {
                                            match = true;
                                            porting.add(d.porting)
                                            diameter.add(d.diameter)
                                            width.add(d.width)
                                            gab.add(d.gab)
                                            dia.add(d.dia)
                                            brand.add(d.brand)
                                            break;
                                        }
                                        match = false
                                    }
                                }
                            }
                            if (match) {
                                fillCatalog(d)
                            }
                            match = true
                        })

                        inputName.add($(this).prev().attr("name"))

                        if (!inputName.has('porting')) {
                            $(".filter__item-list.porting").html("")
                            fillFilterItem(Array.from(porting).sort(), $('.row.wheels .filter__item-list.porting'), 'porting')
                        }
                        if (!inputName.has('diameter')) {
                            $(".filter__item-list.diameter").html("")
                            fillFilterItem(Array.from(diameter).sort(), $('.row.wheels .filter__item-list.diameter'), 'diameter')
                        }
                        if (!inputName.has('width')) {
                            $(".filter__item-list.width").html("")
                            fillFilterItem(Array.from(width).sort(), $('.row.wheels .filter__item-list.width'), 'width')
                        }
                        if (!inputName.has('gab')) {
                            $(".filter__item-list.gab").html("")
                            fillFilterItem(Array.from(gab).sort(), $('.row.wheels .filter__item-list.gab'), 'gab')
                        }
                        if (!inputName.has('dia')) {
                            $(".filter__item-list.dia").html("")
                            fillFilterItem(Array.from(dia).sort(), $('.row.wheels .filter__item-list.dia'), 'dia')
                        }
                        if (!inputName.has('brand')) {
                            $(".filter__item-list.brand").html("")
                            fillFilterItem(Array.from(brand).sort(), $('.row.wheels .filter__item-list.brand'), 'brand')
                        }

                        $('.filter__loading').css('display', 'none')
                        $('.catalog__loading').css('display', 'none')

                        setTimeout(() => {
                            selector.off("click")
                            selector = $('.filter .row:not(.cars) input[type="radio"]:not(:checked)+label, .filter .row:not(.cars) input[type="checkbox"]+label')
                            selector.on("click", func(selector, inputName, catalogBlock, filterType))
                        }, 1500)

                        let parameters = "/"

                        for (let input in inputs) {
                            if (inputs[input].length) {
                                if (inputs[input].length > 1) {
                                    parameters += `${input}-is-`
                                }
                                inputs[input].forEach(i => {
                                    if (inputs[input].length > 1) {
                                        parameters += `${i}-or-`
                                    }
                                    else {
                                        parameters += `${input}-is-${i}`
                                    }
                                })
                                if (inputs[input].length > 1) {
                                    parameters = parameters.substring(0, parameters.length - 4)
                                }
                                parameters += '/'
                            }
                        }

                        parameters = parameters.toLowerCase()

                        let text;

                        if (filterType != 'wheels') {
                            switch (inputs['type'][0]) {
                                default:
                                    text = 'Легковые авто'
                                    break
                                case '2':
                                    text = 'Грузовые авто'
                                    break
                                case '3':
                                    text = 'Мото-квадро'
                                    break
                            }
                        }

                        history.replaceState(null, null,  `/sibirkoleso/${filterType}.html` + parameters)
                        filterTitle.html(
                            text +
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
                    }
                })
            }
            else {
                $.ajax({
                    url: '/sibirkoleso/data.json',
                    success: (data) => {
                        let width = new Set()
                        let height = new Set()
                        let diameter = new Set()
                        let brand = new Set()
                        let empty = true
                        let match = true

                        for (let input in inputs) {
                            inputs[input].forEach(() => {
                                empty = false
                            })
                            if (!empty) {
                                break
                            }
                        }

                        if (empty) {
                            $('.filter__loading').css('display', 'none')
                            return data;
                        }
                        catalogBlock.html("")

                        data.forEach(d => {
                            for (let input in inputs) {
                                if (match) {
                                    for (let val in inputs[input]) {
                                        if (d[input] == inputs[input][val]) {
                                            match = true;
                                            width.add(d.width)
                                            height.add(d.height)
                                            diameter.add(d.diameter)
                                            brand.add(d.brand)
                                            break;
                                        }
                                        match = false
                                    }
                                }
                            }
                            if (match) {
                                fillCatalog(d)
                            }
                            match = true
                        })


                        inputName.add($(this).prev().attr("name"))

                        if (!inputName.has('width')) {
                            $(".filter__item-list.width").html("")
                            fillFilterItem(Array.from(width).sort(), $('.row.tyres .filter__item-list.width'), 'width')
                        }
                        if (!inputName.has('height')) {
                            $(".filter__item-list.height").html("")
                            fillFilterItem(Array.from(height).sort(), $('.row.tyres .filter__item-list.height'), 'height')
                        }
                        if (!inputName.has('diameter')) {
                            $(".filter__item-list.diameter").html("")
                            fillFilterItem(Array.from(diameter).sort(), $('.row.tyres .filter__item-list.diameter'), 'diameter')
                        }
                        if (!inputName.has('brand')) {
                            $(".filter__item-list.brand").html("")
                            fillFilterItem(Array.from(brand).sort(), $('.row.tyres .filter__item-list.brand'), 'brand')
                        }

                        $('.filter__loading').css('display', 'none')
                        $('.catalog__loading').css('display', 'none')

                        setTimeout(() => {
                            selector.off("click")
                            selector = $('.filter .row:not(.cars) input[type="radio"]:not(:checked)+label, .filter .row:not(.cars) input[type="checkbox"]+label')
                            selector.on("click", func(selector, inputName, catalogBlock, filterType))
                        }, 1500)

                        let parameters = "/"

                        for (let input in inputs) {
                            if (inputs[input].length) {
                                if (inputs[input].length > 1) {
                                    parameters += `${input}-is-`
                                }
                                inputs[input].forEach(i => {
                                    if (inputs[input].length > 1) {
                                        parameters += `${i}-or-`
                                    } else {
                                        parameters += `${input}-is-${i}`
                                    }
                                })
                                if (inputs[input].length > 1) {
                                    parameters = parameters.substring(0, parameters.length - 4)
                                }
                                parameters += '/'
                            }
                        }

                        parameters = parameters.toLowerCase()

                        let text;

                        switch (inputs['type'][0]) {
                            default:
                                text = 'Легковые авто'
                                break
                            case '2':
                                text = 'Грузовые авто'
                                break
                            case '3':
                                text = 'Мото-квадро'
                                break
                        }

                        history.replaceState(null, null, `/sibirkoleso/${filterType}.html` + parameters)
                        filterTitle.html(
                            text +
                            "<img alt=\"\" class=\"filter__type-img\" src=\"img/arrow.svg\">"
                        )
                        if (filterTitle.text() != 'Легковые авто') {
                            filterSeasons.find(".row").removeClass('active')
                            filterSeasons.css('display', 'none')
                        } else {
                            filterSeasons.find(".row").addClass('active')
                            $('.filter__type-list input').removeAttr('checked')
                            filterSeasons.css('display', 'block')
                            $('.filter__type-list').removeClass('open')
                        }
                    }
                })
            }

        }, 0)
    })
}