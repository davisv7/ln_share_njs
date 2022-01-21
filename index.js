const lnService = require("ln-service");
const config = require("./config");
const { subscribeToInvoices } = require("ln-service");

const start = async function () {
  // connect to lnd node (aka bob)
  console.log("(re)starting");
  const { lnd } = lnService.authenticatedLndGrpc({
    cert: config.bob.cert,
    macaroon: config.bob.macaroon,
    socket: config.bob.socket,
  });
  // subscribe to invoices
  const sub = subscribeToInvoices({ lnd });

  // upon payment, check memo
  // if memo contains keyword, trigger arbitrary action
  // const [lastUpdatedInvoice] = await once(sub, "invoice_updated");
  sub.on('invoice_updated', invoice => {
    if (invoice.is_confirmed) {
      // invoice is paid, perform action
      console.log(invoice.description);
    } else {
      console.log("Invoice updated, but not paid.");
    }
  })
}


try {
  setInterval(start, 1000);
} catch (error) {
  console.log(error);
}
