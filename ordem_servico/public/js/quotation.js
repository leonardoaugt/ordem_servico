frappe.ui.form.on("Quotation", {
  after_save: function(frm) {
    //Set Quotation on OS History section
    if (frm.doc.os_interna_link) {
      frappe.call({
        method: "ordem_servico.ordem_servico.utils.set_quotation_history",
        args: {
          source_docname: frm.doc.name,
          source_transaction_date: frm.doc.transaction_date,
          target_docname: frm.doc.os_interna_link
        }
      });
    }
  }
});
