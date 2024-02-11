const supabase = require("./db.js");
const router = require("express").Router();

router.route("/sme").post(async (req, res) => {
    const { agent_id } = req.body;

    try {
        let smes = await supabase.any(`select "nid", "phone", "name", "avatarLink", "permanentAddress", "rank", "points", "cashback"
                                            from "Sme" as S, "User" as U, "Rank" as R
                                            where S."id" = U."id"
                                            and S."rank" = R."className"
                                            and "agentId" = $1`, [agent_id]);
        let products = await supabase.any(`select "id", "name", "unit", "unitPrice", "taxPercentage", "imageLink", "amount" from "Product", "Inventory"
                                            where "id" = "productId" 
                                            and "unionId" = (select "unionId" from "User"
                                                            where "id" = $1) 
                                            and "amount" > 0;`, [agent_id]);
        let response = {
            smes: smes,
            products: products,
        }
        res.status(200).send(response);
    }
    catch (error) {
        console.error("Error in /sell_request/sme:", error);
        let respone = {
            status: "failed",
            message: "Internal server error",
        };
        res.status(500).send(respone);
    }

});

router.route("/vendor").post(async (req, res) => {
    const { agent_id } = req.body;

    try {
        let vendors = await supabase.any(`select "nid", "phone", "name", "avatarLink", "permanentAddress", "rank", "points", "cashback"
                                        from "Vendor" as V, "User" as U, "Rank" as R
                                        where V."id" = U."id"
                                        and V."rank" = R."className"
                                        and "agentId" = $1`, [agent_id]);
        let products = await supabase.any(`select "id", "name", "unit", "unitPrice", "taxPercentage", "imageLink", "amount" from "Product", "Inventory"
                                            where "id" = "productId" 
                                            and "unionId" = (select "unionId" from "User"
                                                            where "id" = $1) 
                                            and "amount" > 0;`, [agent_id]);
        let response = {
            vendors: vendors,
            products: products,
        }
        res.status(200).send(response);
    }
    catch (error) {
        console.error("Error in /sell_request/vendor:", error);
        let respone = {
            status: "failed",
            message: "Internal server error",
        };
        res.status(500).send(respone);
    }

});

router.route("/sme/submit").post(async (req, res) => {
    const { sellReq, sellItems } = req.body;
    try{
        let sellReqId = await supabase.any(`insert into "SmeSell" ("agentId", "smeId", "total", "cashback") 
                                            values ($1, $2, $3, $4) returning "id"`, 
                                            [sellReq.agentId, sellReq.smeId, sellReq.total, sellReq.cashback]);
        sellReqId = sellReqId[0].id;
        for (let i = 0; i < sellItems.length; i++) {
            let sellItem = sellItems[i];
            await supabase.none(`insert into "SmeSellItem" ("tid", "pid", "quantity", "total") 
                                values ($1, $2, $3, $4)`, 
                                [sellReqId, sellItem.productId, sellItem.quantity, sellItem.price]);
        }
        let info = await supabase.any(`select "id", "timestamp", "status" from "SmeSell" where "id" = $1`, [sellReqId]);
        res.status(200).send(info);
    }
    catch (error) {
        console.error("Error in /sell_request/sme/submit:", error);
        let respone = {
            status: "failed",
            message: "Internal server error",
        };
        res.status(500).send(respone);
    }
});

router.route("/vendor/submit").post(async (req, res) => {
    const { sellReq, sellItems } = req.body;
    try{
        let sellReqId = await supabase.any(`insert into "VendorSell" ("agentId", "vendorId", "total", "cashback") 
                                            values ($1, $2, $3, $4) returning "id"`, 
                                            [sellReq.agentId, sellReq.vendorId, sellReq.total, sellReq.cashback]);
        sellReqId = sellReqId[0].id;
        for (let i = 0; i < sellItems.length; i++) {
            let sellItem = sellItems[i];
            await supabase.none(`insert into "VendorSellItem" ("tid", "pid", "quantity", "total") 
                                values ($1, $2, $3, $4)`, 
                                [sellReqId, sellItem.productId, sellItem.quantity, sellItem.price]);
        }
        let info = await supabase.any(`select "id", "timestamp", "status" from "VendorSell" where "id" = $1`, [sellReqId]);
        res.status(200).send(info);
    }
    catch (error) {
        console.error("Error in /sell_request/vendor/submit:", error);
        let respone = {
            status: "failed",
            message: "Internal server error",
        };
        res.status(500).send(respone);
    }
});

module.exports = router;