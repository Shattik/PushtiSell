const supabase = require("./db.js");
const router = require("express").Router();

router.route("/vendor/reject").post(async (req, res) => {
    const { id } = req.body;
    try {
        await supabase.any(`UPDATE "VendorSell" SET status = 'rejected' WHERE id = $1`, [id]);
        let response = {
            status: "success",
            message: "Rejected successfully"
        }
        res.json(response);
    }
    catch (error) {
        let response = {
            status: "error",
            message: "Error in rejecting"
        }
        res.json(response);
    }
});

router.route("/sme/reject").post(async (req, res) => {
    const { id } = req.body;
    try {
        await supabase.any(`UPDATE "SmeSell" SET status = 'rejected' WHERE id = $1`, [id]);
        let response = {
            status: "success",
            message: "Rejected successfully"
        }
        res.json(response);
    }
    catch (error) {
        let response = {
            status: "error",
            message: "Error in rejecting"
        }
        res.json(response);
    }
});

router.route("/vendor/accept").post(async (req, res) => {
    const { id } = req.body;
    try {
        await supabase.any(`UPDATE "VendorSell" SET status = 'approved' WHERE id = $1`, [id]);
        let response = {
            status: "success",
            message: "Accepted successfully"
        }
        res.json(response);
    }
    catch (error) {
        let response = {
            status: "error",
            message: "Inventory exceeded"
        }
        res.json(response);
    }
});

router.route("/sme/accept").post(async (req, res) => {
    const { id } = req.body;
    try {
        await supabase.any(`UPDATE "SmeSell" SET status = 'approved' WHERE id = $1`, [id]);
        let response = {
            status: "success",
            message: "Accepted successfully"
        }
        res.json(response);
    }
    catch (error) {
        let response = {
            status: "error",
            message: "Inventory exceeded"
        }
        res.json(response);
    }
});

module.exports = router;