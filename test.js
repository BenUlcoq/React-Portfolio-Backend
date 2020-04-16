import express from "express";
import { urlencoded, json } from "body-parser";
import { resolve } from "path";
import { uploader, cloudinaryConfig } from "./config/cloudinaryConfig";
import { multerUploads, dataUri } from "./middlewares/multerUpload";
const app = express();
const Port = process.env.PORT || 3000;
app.use(express.static(resolve(__dirname, "src/public")));
app.use(urlencoded({ extended: false }));
app.use(json());
app.use("*", cloudinaryConfig);
app.get("/*", (req, res) =>
  res.sendFile(resolve(__dirname, "../public/index.html"))
);
app.post("/upload", multerUploads, (req, res) => {
  if (req.file) {
    const file = dataUri(req).content;
    return uploader
      .upload(file)
      .then(result => {
        const image = result.url;
        return res.status(200).json({
          messge: "Your image has been uploded successfully to cloudinary",
          data: {
            image
          }
        });
      })
      .catch(err =>
        res.status(400).json({
          messge: "someting went wrong while processing your request",
          data: {
            err
          }
        })
      );
  }
});
app.listen(Port, () =>
  console.log(`Server started at http://localhost:${Port}`)
);
