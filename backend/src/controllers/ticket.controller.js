const ticketModel = require("../models/ticket.model");

// POST /tickets/create
const createTicketController = async (req, res) => {
  try {
    const { sessionId, title, description, customerName, customerEmail } =
      req.body;

    if (!sessionId || !title || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const ticket = await ticketModel.create({
      sessionId,
      title,
      description,
      customerName,
      customerEmail,
    });

    res.status(201).json({
      message: "Ticket created successfully",
      data: ticket,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// GET /tickets
const getAllTicketsController = async (req, res) => {
  try {
    const tickets = await ticketModel.find().populate("sessionId");

    res.status(200).json({
      message: "Tickets fetched successfully",
      data: tickets,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  createTicketController,
  getAllTicketsController,
};
