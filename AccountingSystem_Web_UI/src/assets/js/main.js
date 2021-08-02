changesLocalStorage = function(e) {
    console.log("The user tried to edit the local storage");
    localStorage.setItem(e.key, e.oldValue);
}
if (window.addEventListener) {
    window.addEventListener('storage', changesLocalStorage, false);
} else {
    window.attachEvent('onstorage', changesLocalStorage);
}


var myExtObject = (function() {
    return {
        openDialog: function() {
            $("body").css("overflow", "hidden");

        },
        closeDialog: function() {
            $("body").css("overflow", "scroll");
        },
        exportPdfFile: function(id, title, data) {
            var printme = document.getElementById(id);
            var wme = window.open("", "", "width=900, height=700");
            wme.document.write("<h2 style='font-weight:bold; text-align: center;'>" + title + "</h2>");
            wme.document.write("<table style='text-align: left'>");
            wme.document.write("<th>#Factura</th><th>Cliente</th><th>Tipo Venta</th><th>Fecha</th><th>Monto Total</th><th>D-151</th><th>Condición</th>");
            for (i = 0; i < data.length; i++) {
                var d = new Date(data[i].registrationDate);
                wme.document.write("<tr>" + " <td>" + data[i].voucher + "</td>" + " <td>" + data[i].customerName + "</td>" + "<td>" + data[i].accountName + "</td>" + " <td>" + d.getDay() + "/" + d.getMonth() + "/" + d.getFullYear() + "</td>" + "<td>" + data[i].totalAmount + "</td>" + "<td>" + data[i].d151Name + "</td>" + "</td>" + "<td>" + data[i].movementTypeName + "</td>" + "</tr>");
            }
            wme.document.write("</table");
            wme.document.write();
            wme.document.close();
            wme.focus();
            wme.print();
            wme.close();
        }
    }
})(myExtObject || {})

function closeModal() {
    $('#pay-modal').modal('hide');
}