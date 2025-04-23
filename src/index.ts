import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());

interface Config {
  delayMs: number;
  failRate: number;
}

let config: Config = {
  delayMs: 50,
  failRate: 0,
};

app.post("/send_message", (req: Request, res: Response) => {
  const { to, from, text} = req.body;

  setTimeout(() => {
    const shouldFail = Math.random() < config.failRate;

    if (shouldFail) {
      return res.status(200).json({
        data: null,
        message: "Simulated failure",
        to,
        from,
        text,
      });
    }

    const trackingId = uuidv4();
    
    console.log({
      id: trackingId,
      status: "Delivered",
      message: "Message sent successfully",
      to,
      from,
      text,
    })
    return res.status(200).json({
      id: trackingId,
      status: "Delivered",
      message: "Message sent successfully",
      to,
      from,
      text,
    });
  }, config.delayMs);
});

app.post("/config", (req: Request, res: Response) => {
  config = { ...config, ...req.body };
  res.json({ message: "Configuration updated", config });
});

app.get("/config", (_req: Request, res: Response) => {
  res.json(config);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`FakeProvider running on port ${PORT}`);
});
