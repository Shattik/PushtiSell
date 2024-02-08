const supabase = require("./db.js");
const router = require("express").Router();

router.post("/vendor", async (req, res) => {
  console.log("Hola");

  const { vendor_id } = req.body;

  try {
    let data = await supabase.any(
      `SELECT "VendorSell"."id" as transactionId, "VendorSell"."total", "VendorSell"."cashback", "VendorSell"."timestamp", "VendorSell"."status", \
        ARRAY_AGG(row_to_json(A.*)) AS sellItems\
        FROM\
          "VendorSell" , (SELECT C."tid", B."name" as productName, B."unit", C."quantity", C."total"\
          FROM "VendorSellItem" as C, "Product" as B where B.id = C.pid) as A\
        where\
          "VendorSell"."id" = A."tid" and "VendorSell"."vendorId" = $1 \
        group by "VendorSell"."id", "VendorSell"."total", "VendorSell"."cashback", "VendorSell"."timestamp", "VendorSell"."status"\
        ORDER BY "VendorSell"."timestamp" DESC;`,
      [vendor_id]
    );
    res.status(200).send(data);
  } catch (error) {
    console.error("Error in /buy_request/farmer:", error);
    let respone = {
      status: "failed",
      message: "Internal server error",
    };
    res.status(500).send(respone);
  }
});

router.post("/sme", async (req, res) => {
  console.log("Hola");

  const { sme_id } = req.body;

  try {
    let data = await supabase.any(
      `SELECT "SmeSell"."id" as transactionId, "SmeSell"."total", "SmeSell"."cashback", "SmeSell"."timestamp", "SmeSell"."status", \
        ARRAY_AGG(row_to_json(A.*)) AS sellItems\
        FROM\
          "SmeSell" , (SELECT C."tid", B."name" as productName, B."unit", C."quantity", C."total"\
          FROM "SmeSellItem" as C, "Product" as B where B.id = C.pid) as A\
        where\
          "SmeSell"."id" = A."tid" and "SmeSell"."smeId" = $1 \
        group by "SmeSell"."id", "SmeSell"."total", "SmeSell"."cashback", "SmeSell"."timestamp", "SmeSell"."status"\
        ORDER BY "SmeSell"."timestamp" DESC;`,
      [sme_id]
    );
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/agent/vendor", async (req, res) => {
  console.log("Hola");

  const { agent_id } = req.body;

  try {
    let data = await supabase.any(
      `SELECT "VendorSell"."id" as transactionId, F."name" as vendorname, F."avatarLink", F."phone", "VendorSell"."total",\
        "VendorSell"."cashback", "VendorSell"."timestamp", "VendorSell"."status",\
        ARRAY_AGG(row_to_json(A.*)) AS sellItems\
        FROM\
          "VendorSell" , (SELECT C."tid", B."name" as productName, B."unit", C."quantity", C."total"\
          FROM "VendorSellItem" as C, "Product" as B where B.id = C.pid) as A,\
          (SELECT "id", "name", "avatarLink", "phone" FROM "User") AS F\
        where\
          "VendorSell"."id" = A."tid" and "VendorSell"."agentId" = $1 and F."id" = "VendorSell"."vendorId"\
        group by "VendorSell"."id", F."name", F."avatarLink", F."phone", "VendorSell"."total", "VendorSell"."cashback", \
        "VendorSell"."timestamp", "VendorSell"."status"\
        ORDER BY "VendorSell"."timestamp" DESC;`,
      [agent_id]
    );

    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/agent/sme", async (req, res) => {
  console.log("Hola");

  const { agent_id } = req.body;

  try {
    let data = await supabase.any(
      `SELECT "SmeSell"."id" as transactionId, F."name" as smename, F."avatarLink", F."phone", "SmeSell"."total",\
        "SmeSell"."cashback", "SmeSell"."timestamp", "SmeSell"."status",\
        ARRAY_AGG(row_to_json(A.*)) AS sellItems\
        FROM\
          "SmeSell" , (SELECT C."tid", B."name" as productName, B."unit", C."quantity", C."total"\
          FROM "SmeSellItem" as C, "Product" as B where B.id = C.pid) as A,\
          (SELECT "id", "name", "avatarLink", "phone" FROM "User") AS F\
        where\
          "SmeSell"."id" = A."tid" and "SmeSell"."agentId" = $1 and F."id" = "SmeSell"."smeId"\
        group by "SmeSell"."id", F."name", F."avatarLink", F."phone", "SmeSell"."total", "SmeSell"."cashback", "SmeSell"."timestamp", "SmeSell"."status"\
        ORDER BY "SmeSell"."timestamp" DESC;`,
      [agent_id]
    );
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
