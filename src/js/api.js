import axios from 'axios';
const perPage = 40;


const fetchData = async function (inputtedValue, pageNumber) {
  try {
    const resp = await axios.get(
      `https://pixabay.com/api/?key=37016311-3dc5b9efa70d4a338f2adabe8&q=${inputtedValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNumber}&per_page=${perPage}`
    );
    return resp.data;
  } catch (error) {
    console.log(error);
  }
};

export default fetchData;