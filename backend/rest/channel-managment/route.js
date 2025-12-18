import { Router } from "express";
import { createChannel, getAllChannelsByOwnerId } from "./controllers.js";

const router = Router();

router.post("/", createChannel);
router.get("/", getAllChannelsByOwnerId);
// router.patch("/:channel_id",protect, updateChannelById);
// router.delete("/:channel_id",protect, deleteChannelById);

export default router;
