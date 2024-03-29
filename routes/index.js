const router = require("express").Router();

const authRoute = require("./auth");
const modelRoute = require("./model");
const clientRoute = require("./client");
const AgencyRoute = require("./agency");
const UserRoute = require("./user");
const AdminRoute = require("./admin");
const JobRoute = require("./job");
const BlogRoute = require("./blog");
const NotificationRoute = require("./notification");
const PaymentRoute = require("./payment");
const ConversationRoute = require("./conversation");
const BookModelRoute = require("./bookModel");
const TransactionRoute = require("./transaction");

router.use("/api/auth", authRoute);
router.use("/api/model", modelRoute);
router.use("/api/client", clientRoute);
router.use("/api/agency", AgencyRoute);
router.use("/api/user", UserRoute);
router.use("/api/admin", AdminRoute);
router.use("/api/job", JobRoute);
router.use("/api/blog", BlogRoute);
router.use("/api/notification", NotificationRoute);
router.use("/api/payment", PaymentRoute);
router.use("/api/conversation", ConversationRoute);
router.use("/api/book", BookModelRoute);
router.use("/api/transaction", TransactionRoute);

module.exports = router;
