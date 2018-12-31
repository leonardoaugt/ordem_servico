frappe.ui.form.on('Ordem Servico Items', {

    item_code: function (frm, cdt, cdn) {
        d = locals[cdt][cdn];
        d.item_qty = 1;
        d.price_amount = d.item_qty * d.item_price;
        frm.refresh_field('quotation_items');
    },

    item_qty: function (frm, cdt, cdn) {
        d = locals[cdt][cdn];
        d.price_amount = d.item_qty * d.item_price;
        frm.refresh_field('quotation_items');
    }
});