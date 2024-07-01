import axios from "axios";

const Instance = axios.create({
  baseURL: "http:localhost:4000",
});

// const getToken = (identity: string) =>
//   Instance({
//     method: "GET",
//     url: `/twilio/accessToken?identity=${identity}`,
//   });

const getToken = async (identity: string) => {
  const response = await axios.get(
    `${
      import.meta.env.VITE_PUBLIC_API_URL
    }/twilio/accessToken?identity=${identity}`
  );
  console.log(response);
  return response.data;
};

export { getToken };
