var Store = {
    toggleGroup: function (field) {
        var group = $(field).parent().next('.item_group');
        if (group.is(":visible")) {
            $(field).html('[+]').attr('data-tip', lang("show", "store"));
        } else {
            $(field).html('[-]').attr('data-tip', lang("hide", "store"));
        }
        group.slideToggle(300);
    },
    toggleAllGroups: function (field) {
        var groups = $(field).parents('.realm_items').find('.hide_group');
        if (/\[\+\]/.test($(field).html())) {
            $(field).html('[-] Hide all item groups');
            groups.each(function () {
                var group = $(this).parent().next('.item_group');
                $(this).html('[-]').attr('data-tip', lang("hide", "store"));
                group.slideDown(300);
            });
        } else {
            $(field).html('[+] Show all item groups');
            groups.each(function () {
                var group = $(this).parent().next('.item_group');
                $(this).html('[+]').attr('data-tip', lang("show", "store"));
                group.slideUp(300);
            });
        }
    },
    Filter: {
        showVote: true,
        showDonate: true,
        displayQuality: "ALL",
        nameFilter: "",
        toggleVote: function (element) {
            element = $(element);
            if (element.hasClass("nice_active")) {
                this.showVote = false;
                $(".vp_button").each(function () {
                    $(this).hide();
                });
                element.removeClass("nice_active");
            } else {
                this.showVote = true;
                $(".vp_button").each(function () {
                    $(this).show();
                });
                element.addClass("nice_active");
            }
            this.filterByPriceType();
        },
        toggleDonate: function (element) {
            element = $(element);
            if (element.hasClass("nice_active")) {
                this.showDonate = false;
                $(".dp_button").each(function () {
                    $(this).hide();
                });
                element.removeClass("nice_active");
            } else {
                this.showDonate = true;
                $(".dp_button").each(function () {
                    $(this).show();
                });
                element.addClass("nice_active");
            }
            this.filterByPriceType();
        },
        initialize: function () {
            $("#store_realms .store_item").each(function () {
                $(this).attr({
                    "data-filter-price": 1,
                    "data-filter-quality": 1,
                    "data-filter-name": 1
                });
            });
        },
        filter: function () {
            var show;
            $("#store_realms .store_item").each(function () {
                show = false;
                if ($(this).attr("data-filter-price") == 1 && $(this).attr("data-filter-quality") == 1 && $(this).attr("data-filter-name") == 1) {
                    show = true;
                }
                if (show) {
                    $(this).slideDown(300);
                } else {
                    $(this).slideUp(300);
                }
            });
        },
        filterByPriceType: function () {
            $("#store_realms .store_item").each(function () {
                var hasVp = false;
                hasDp = false;
                canHide = true;
                $(this).find(".store_buttons a").each(function () {
                    value = $(this).html().replace(/<.*>/, "");
                    price = parseInt(value.replace(/[^0-9]+/, ""));
                    if (/DP/.test(value)) {
                        hasDp = true;
                    } else {
                        hasVp = true;
                    }
                });
                if (hasVp && Store.Filter.showVote && canHide) {
                    canHide = false;
                }
                if (hasDp && Store.Filter.showDonate && canHide) {
                    canHide = false;
                }
                if (canHide) {
                    $(this).attr("data-filter-price", 0);
                } else {
                    $(this).attr("data-filter-price", 1);
                }
            });
            Store.Filter.filter();
        },
        toggle: function (id) {
            var field = $("#realm_items_" + id);
            if (field.is(":visible")) {
                $("#realm_indicator_" + id).html("[+]");
                field.fadeOut(300);
            } else {
                $("#realm_indicator_" + id).html("[-]");
                field.fadeIn(300);
            }
        },
        filterByName: function () {
            var name, regex = new RegExp(this.nameFilter, "i");
            $("#store_realms .store_item").each(function () {
                name = $(this).find(".item_name").html();
                if (!regex.test(name)) {
                    $(this).attr("data-filter-name", 0);
                } else {
                    $(this).attr("data-filter-name", 1);
                }
            });
            Store.Filter.filter();
        },
        setName: function (text) {
            text = text.replace(/[^A-Za-z0-9]+/, "");
            this.nameFilter = text;
            this.filterByName();
        },
        setQuality: function (value) {
            this.displayQuality = value;
            this.filterByQuality();
        },
        filterByQuality: function () {
            $("#store_realms .store_item").each(function () {
                if (Store.Filter.displayQuality == "ALL") {
                    $(this).attr("data-filter-quality", 1);
                } else {
                    item = $(this).find(".item_name");
                    if (item.hasClass("q" + Store.Filter.displayQuality)) {
                        $(this).attr("data-filter-quality", 1);
                    } else {
                        $(this).attr("data-filter-quality", 0);
                    }
                }
            });
            Store.Filter.filter();
        },
        sort: function (value) {
            if (typeof Store.Filter.Sorting[value] != "undefined") {
                $('#store_realms .item_group').each(function () {
                    $(this).find('.store_item').sortElements(Store.Filter.Sorting[value]);
                });
                $('#store_realms > .store_item').sortElements(Store.Filter.Sorting[value]);
            }
        },
        Sorting: {
            standard: function (a, b) {
                return parseInt($(a).attr("id").replace("item_", "")) > parseInt($(b).attr("id").replace("item_", "")) ? 1 : -1;
            },
            name: function (a, b) {
                return $(a).find(".item_name").html() > $(b).find(".item_name").html() ? 1 : -1;
            },
            priceVp: function (a, b) {
                return $(a).find(".vp_price_value").html() > $(b).find(".vp_price_value").html() ? 1 : -1;
            },
            priceDp: function (a, b) {
                return $(a).find(".dp_price_value").html() > $(b).find(".dp_price_value").html() ? 1 : -1;
            },
            quality: function (a, b) {
                return parseInt($(a).find(".item_name").attr("class").replace("item_name q", "")) < parseInt($(b).find(".item_name").attr("class").replace("item_name q", "")) ? 1 : -1;
            }
        },
        updatePrices: function () {
            var value, price;
            $("#store_realms .store_item").each(function () {
                $(this).find(".store_buttons a").each(function () {
                    value = $(this).html().replace(/<.*>/, "");
                    price = parseInt(value.replace(/[^0-9]+/, ""));
                    if (/DP/.test(value)) {
                        if (price > Store.Customer.dp) {
                            $(this).fadeTo(300, 0.5);
                        } else {
                            $(this).fadeTo(300, 1);
                        }
                    } else {
                        if (price > Store.Customer.vp) {
                            $(this).fadeTo(300, 0.5);
                        } else {
                            $(this).fadeTo(300, 1);
                        }
                    }
                });
            });
        }
    },
    Customer: {
        vp: 0,
        dp: 0,
        initialize: function (vp, dp) {
            this.vp = vp;
            this.dp = dp;
            Store.Filter.initialize();
        },
        add: function (price, priceType) {
            this[priceType] += price;
            if ($("#info_" + priceType).length) {
                $("#info_" + priceType).html(this[priceType]);
            }
            Store.Filter.updatePrices();
        },
        subtract: function (price, priceType, callback) {
            var old = this[priceType];
            this[priceType] -= price;
            if (this[priceType] < 0) {
                this[priceType] = old;
                UI.alert(lang("cant_afford", "store"));
            } else {
                if ($("#info_" + priceType).length) {
                    $("#info_" + priceType).html(this[priceType]);
                }
                Store.Filter.updatePrices();
                callback();
            }
        }
    },
    Cart: {
        items: {},
        list: [],
        vpCost: 0,
        dpCost: 0,
        count: 0,
        add: function (id, itemId, name, price, priceType, realm, realmId, quality, tooltip) {
            name = name.replace(/\//, "");
            realm = realm.replace(/\//, "");
            Store.Customer.subtract(price, priceType, function () {
                if (priceType == "vp") {
                    Store.Cart.vpCost += price;
                } else if (priceType == "dp") {
                    Store.Cart.dpCost += price;
                }
                var itemObject = {
                    id: id,
                    price: price,
                    priceType: priceType
                };
                Store.Cart.list.push({
                    id: id,
                    type: priceType
                });
                Store.Cart.updatePrice();
                $("#cart_item_count").html(Store.Cart.list.length);
                var isInCart = Store.Cart.isInCart(id, priceType);
                if (isInCart) {
                    var countField = $("#cart_item_count_" + isInCart),
                        itemCount;
                    if (countField.html().length == 0) {
                        itemCount = 2;
                    } else {
                        itemCount = parseInt(countField.html().replace("x ", "")) + 1;
                    }
                    countField.html("x " + itemCount);
                    Store.Cart.count++;
                } else {
                    Store.Cart.items[Store.Cart.count] = itemObject;
                    $("#empty_cart").fadeOut(50, function () {
                        var tooltipHTML = (tooltip) ? 'data-realm="' + realmId + '" rel="item=' + itemId + '"' : '';
                        var itemHTML = '<article class="store_item" id="cart_item_' + Store.Cart.count + '">' + '<div class="item_price">' + '<img src="' + Config.URL + 'application/images/icons/' + ((priceType == "vp") ? "lightning" : "coins") + '.png" align="absmiddle" />' +
                            price + " " + ((priceType == "vp") ? lang("vp", "store") : lang("dp", "store")) + '</div>' + '<a href="javascript:void(0)" onClick="Store.Cart.remove(' + id + ', ' + Store.Cart.count + ')" class="delete_item">' + '<img src="' + Config.URL + 'application/images/icons/delete.png" align="absmiddle" />' + '</a>' + '<a href="' + Config.URL + 'item/' + realmId + '/' + itemId + '" class="item_name q' + quality + '" ' + tooltipHTML + '>' +
                            name + ' <span id="cart_item_count_' + Store.Cart.count + '"></span>' + '</a>' + '<div class="item_realm">' + realm + '</div>' + '<div class="clear"></div>' + '</article>';
                        $("#cart_items").append(itemHTML);
                        $("#cart_item_" + Store.Cart.count).slideDown(150, function () {
                            Tooltip.refresh();
                        });
                        Store.Cart.count++;
                    });
                }
            });
        },
        isInCart: function (id, priceType) {
            for (i in this.items) {
                try {
                    if (id == this.items[i].id && priceType == this.items[i].priceType) {
                        return i;
                    }
                } catch (error) { }
            }
            return false;
        },
        remove: function (id, countId) {
            var priceType;
            try {
                var itemCount;
                if ($("#cart_item_count_" + countId).html().length != 0) {
                    itemCount = parseInt($("#cart_item_count_" + countId).html().replace("x ", ""));
                } else {
                    itemCount = 1;
                }
                this[this.items[countId].priceType + "Cost"] -= this.items[countId].price * itemCount;
                Store.Customer.add(this.items[countId].price * itemCount, this.items[countId].priceType);
                priceType = this.items[countId].priceType;
                this.items[countId] = null;
            } catch (error) { }
            var n;
            for (var i = 0; i < itemCount; i++) {
                for (n in Store.Cart.list) {
                    if (Store.Cart.list[n].id == id && (Store.Cart.list[n].type == priceType || typeof priceType == "undefined")) {
                        this.list.splice(n, 1);
                    }
                }
            }
            this.updatePrice();
            $("#cart_item_count").html(Store.Cart.list.length);
            $("#cart_item_" + countId).slideUp(150, function () {
                $(this).remove();
                if (Store.Cart.list.length == 0) {
                    setTimeout(function () {
                        if (Store.Cart.list.length == 0) {
                            $("#empty_cart").fadeIn(150);
                        }
                    }, 500);
                }
            });
        },
        checkout: function (button) {
            var cartList = JSON.stringify(this.list);
            alert(cartList);
            //            $(button).addClass("nice_active").removeAttr("href").removeAttr("onClick").html("Loading...");
            //            $.post(Config.URL + "store/checkout", {
            //                cart: cartList,
            //                csrf_token_name: Config.CSRF
            //            }, function (data) {
            //                $("#store").fadeOut(150, function () {
            //                    $(button).removeClass("nice_active").attr("href", "javascript:void(0)").attr("onClick", "Store.Cart.checkout(this)").html(lang("checkout", "store"));
            //                    $("#checkout").html(data).fadeIn(150, function () {
            //                        Tooltip.refresh();
            //                    });
            //                });
            //            });
        },
        pay: function () {
            UI.confirm(lang("want_to_buy", "store"), lang("yes", "store"), function () {
                $("[data-id]").attr("data-available", "1");
                for (i in Store.Cart.list) {
                    if (typeof Store.Cart.list[i].character != "undefined") {
                        delete Store.Cart.list[i]["character"];
                    }
                    $("[data-id=\"" + Store.Cart.list[i].id + "\"]").each(function () {
                        if ($(this).attr("data-available") == "1" && typeof Store.Cart.list[i].character == "undefined") {
                            $(this).attr("data-available", "0");
                            Store.Cart.list[i].character = $(this).val();
                            console.log(Store.Cart.list[i].character)
                        }
                    });
                }
                var data = JSON.stringify(Store.Cart.list);
                $("#checkout").fadeOut(150, function () {
                    $("#checkout").html('<center><img src="' + Config.image_path + 'ajax.gif" /></center>').fadeIn(150, function () {
                        $.post(Config.URL + "store/pay", {
                            data: data,
                            csrf_token_name: Config.CSRF
                        }, function (data) {
                            $("#store_wrapper").fadeOut(150, function () {
                                $("#store_wrapper").html(data).fadeIn(150, function () {
                                    Store.Cart.items = {};
                                    Store.Cart.list = [];
                                    Store.Cart.vpCost = 0;
                                    Store.Cart.dpCost = 0;
                                    Store.Cart.count = 0;
                                    Store.updatePrice();
                                    $("#cart_item_count").html('0');
                                });
                            });
                        });
                    })
                });
            });
        },
        updatePrice: function () {
            if (this.list.length == 0) {
                this.vpCost = 0;
                this.dpCost = 0;
                setTimeout(function () {
                    $("#cart_price").fadeOut(300);
                }, 350);
            } else if (!$("#cart_price").is(":visible")) {
                setTimeout(function () {
                    $("#cart_price").fadeIn(300);
                }, 350);
            }
            var vp = $("#vp_price");
            var dp = $("#dp_price");
            if (vp.html() != this.vpCost) {
                vp.fadeTo(300, 0, function () {
                    vp.html(Store.Cart.vpCost);
                    vp.fadeTo(300, 1);
                });
            }
            if (dp.html() != this.dpCost) {
                dp.fadeTo(300, 0, function () {
                    dp.html(Store.Cart.dpCost);
                    dp.fadeTo(300, 1);
                });
            }
        },
        back: function () {
            $("#checkout").fadeOut(150, function () {
                $("#store").fadeIn(150);
            });
        }
    }
}
