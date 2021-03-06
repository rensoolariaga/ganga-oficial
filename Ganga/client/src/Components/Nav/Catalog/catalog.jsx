import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProduct,
  orderByPrice,
  getUser,
  getCategories,
  allReviews,
  getUserInfoGoogle
  /*productsByName*/
} from "../../Redux/Actions/actions";
import Card from "../../Card/card";
import User from "../User/user";
import "./catalog.css";
import FilterPrice from "../Filter/filterPrice";
import Pagination from "../../Home/Pagination/pagination";
import download from "../../Resources/cargando.gif";
import Nav from "../NavBar/nav";
import FooterCatalog from "../../Home/Footer/footerCatalog";

export default function Catalogo() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.getInfoGoogle)
  const allProduct = useSelector((state) => state.product);
  let products = allProduct.filter((p) => p.approved === true);
  products = products.filter((p) => p.stock > 0);

  const Reviews = useSelector((state) => state.allReviews);
  

  useEffect(() => {
    dispatch(allReviews())
    dispatch(getUserInfoGoogle())
  },[dispatch]);


  const [, setOrden] = useState("");
  // const [filteredData, setFilteredData] = useState([]);
  // const [wordEntered, setWordEntered] = useState("");

  // const [name, setName] = useState(" ");

  const [currentPage, setCurrentPage] = useState(1);
  const [elementsPerPage /*setElementsPerPage*/] = useState(12);
  const indexOfLastProducts = currentPage * elementsPerPage;
  const indexOfFirstProducts = indexOfLastProducts - elementsPerPage;
  const currentProducts = products?.slice(
    indexOfFirstProducts,
    indexOfLastProducts
  );

  const paginate = (pageNumbers) => {
    setCurrentPage(pageNumbers);
  };

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  function handleClick(e) {
    e.preventDefault();
    dispatch(getProduct());
    setCurrentPage(1);
  }

  function handleOrder(e) {
    e.preventDefault();
    dispatch(orderByPrice(e.target.value));
    setCurrentPage(1);
    setOrden(`Ordenado ${e.target.value}`);
  }

  // function handleInput(e) {
  //   e.preventDefault();
  //   setName(e.target.value);
  // }
  // function handleSubmit(e) {
  //   e.preventDefault();
  //   dispatch(productsByName(name));
  //   setName(" ");
  // }
  return (
    <div className="containerCatalog">
       {user && user.login ? (
        <div>
          <div className="absolute top-5 right-20 z-50 mr-10 w-28">
            <User />
          </div>
          <Nav className="flex justify-between items-center h-20 w-8 text-black" />
        </div>
      ) : null}
      <div className="bannerProd"> 

      </div>
      <div className="inf">
        <div className="filtros">
          <div className="conNameFil">
            <h1 className="nameFil">FILTROS:</h1>
          </div>
          <div className="inputContainerCatalog">
            <FilterPrice />
          </div>
          <div className="selectFilter">
            <select className="select" onChange={(e) => handleOrder(e)}>
              <option> ordena por precio: </option>
              <option value="Menor-Mayor"> Mayor a Menor </option>
              <option value="Mayor-Menor"> Menor a Mayor </option>
            </select>
          </div>
          <div className="conBor">
            <button className="bor" onClick={handleClick}>
              Borrar Filtros
            </button>
          </div>
        </div>
      </div>
      <div className="containerCards">
        {currentProducts?.length === 0 ? (
          <div className="download">
            <img src={download} alt="" />
          </div>
        ) : (
          currentProducts.map((el, i) => {
            return (
              <div className="cardProducts" key={"card" + i}>
                <Card
                  name={el.name}
                  image={el.image}
                  price={el.price}
                  id={el.id}
                  reviews={Reviews}
                />
              </div>
            );
          })
        )}
      </div>
      <Pagination
        elementsPerPage={elementsPerPage}
        allProduct={products}
        paginate={paginate}
      />
      <FooterCatalog />
    </div>
  );
}
