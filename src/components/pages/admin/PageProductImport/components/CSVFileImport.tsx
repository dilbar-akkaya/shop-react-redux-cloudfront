import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);
    console.log(localStorage, "localstorage");
    console.log(localStorage.getItem("authorization_token"), "1tok from local");
    if (!file) {
      console.log("File is undefined");
      return;
    }
    console.log(localStorage.getItem("authorization_token"), "2tok from local");
    // Get the presigned URL
    const tokenFromLocalStorage = localStorage.getItem("authorization_token");
    console.log("auth token", tokenFromLocalStorage);
    try {
      const response = await axios({
        method: "GET",
        url,
        params: {
          name: encodeURIComponent(file.name),
        },
        headers: {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
          Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
        },
      });
      console.log("File to upload: ", file.name);
      console.log("Uploading to: ", response.data);
      const result = await fetch(response.data, {
        method: "PUT",
        body: file,
      });
      console.log("Result: ", result);
    } catch (err) {
      console.error(err);
    }
    setFile(undefined);
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
