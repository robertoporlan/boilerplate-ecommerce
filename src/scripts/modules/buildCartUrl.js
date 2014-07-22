var buildCartUrl = function(products) {
    var i = 0,
        len = products.length,
        url = "/checkout/cart/add?";

    for (;i < len; i++) {
        url += "&sku=" + products[i].sku
            + "&qty=" + products[i].qty
            + "&seller=" + products[i].seller;
    }

    url = url.replace("&", "") + "&sc=1";

    return url;
};

// Forma de uso
buildCartUrl(arrayElementos);