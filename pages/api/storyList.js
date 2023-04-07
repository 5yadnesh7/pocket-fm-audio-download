import Axios from "axios";

const storyList = (req, res) => {
  try {
    const { showId, page } = req.body;
    const url = `https://web.pocketfm.com/v2/content_api/show.get_details?show_id=${showId}&curr_ptr=${page}&info_level=max`;
    const config = {
      method: "get",
      url: url,
      headers: {
        "Content-Type": "application/json",
        "app-version": "180",
      },
    };

    Axios(config).then((rsp) => {
      const resp = rsp.data?.result[0];
      if (resp) {
        return res.status(200).send({ isErr: 0, msg: "Success", res: resp });
      } else {
        return res.status(200).send({ isErr: 0, msg: "Fail", res: resp });
      }
    });
  } catch (err) {
    const msg = err?.message || "Something went wrong";
    return res.status(200).send({ isErr: 1, msg, res: [] });
  }
};

export default storyList;
