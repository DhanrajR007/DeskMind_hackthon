const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticket.controller");

router.post("/create", ticketController.createTicketController);
router.get("/", ticketController.getAllTicketsController);

module.exports = router;
