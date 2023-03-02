import React,  { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import Cards from "../../components/Cards";
import "./explore.css";
import { Link } from "react-router-dom";
import Button from "../../common/button";
// import contents from "./content";

export default function Explore({marketplace, nft}) {
  // const { chain } = useNetwork();
  const { address } = useAccount();
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [myItems, setMyItems] = useState([])
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    loadMarketplaceItems()
    loadYourItems()
  }, [])

  const loadMarketplaceItems = async () => {
    // Load all unsold items
    const itemCount = await marketplace.itemCount()
    let items = []
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i)
      if (!item.sold) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(item.tokenId)
        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(uri)
        const metadata = await response.json()
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(item.itemId)
        // Add item to items array
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        })
      }
    }
    setLoading(false)
    setItems(items)
  }

  const loadYourItems = async () => {
    // Load all unsold items
    const itemCount = await marketplace.itemCount()
    let items = []
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i)
      if (item.sold && item.buyer===address) {
        // if ((item.sold && item.buyer==address) || (!item.sold && item.seller==address)) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(item.tokenId)
        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(uri)
        const metadata = await response.json()
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(item.itemId)
        // Add item to items array
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        })
      }
    }
    setLoading(false)
    setMyItems(items)
  }

  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )

  return (
    <>
    <div>
      <div className="tabs">
        <button className={activeTab === 0 ? "active" : ""} onClick={() => setActiveTab(0)}>Trending NFTs</button>
        <button className={activeTab === 1 ? "active" : ""} onClick={() => setActiveTab(1)}>Your NFTs</button>
      </div>
      <div className="tab-content">
        {activeTab === 0 && 
           <>
           {items.length>0 ? 
             <>
             {/* <span className="header absolute-center header-gradient">
               {" "}
               Trending NFTS{" "}
             </span> */}
             <div className="explore-cards">
               {items.map((item) => (
                 <Cards
                   index={0}
                   item={item}
                   marketplace={marketplace}
                 />
               ))}
             </div>
             </>
           :
           (
             <h1 className="absolute-center">No Listed Items</h1>
           )}
           </> 
        }
        {activeTab === 1 && 
          <>
          {myItems.length>0 ? 
            <>
            {/* <span className="header absolute-center header-gradient">
              {" "}
              Your NFTS{" "}
            </span> */}
            <div className="explore-cards">
              {myItems.map((item) => (
                <Cards
                  index={1}
                  item={item}
                  marketplace={marketplace}
                />
              ))}
            </div>
            </>
          :
          (
            <h1 className="absolute-center">No Listed Items</h1>
          )}
          </>
        }
      </div>
      <div className="absolute-center exp-btns"> 
        <Link to="/" style={{textDecoration:'none'}} > 
          <Button btnType="PRIMARY" btnText="Back" />
        </Link>
      </div>
    </div>
  </>
  )
}




{/* <span className="header absolute-center header-gradient">
        {" "}
        Trending NFTS{" "}
      </span>
      <div className="explore-cards">
        {contents.map((contents) => (
          <Cards
            key={contents.id}
            image={contents.image}
            name={contents.name}
            price={contents.price}
            totalSales={contents.totalSales}
            timeLeft={contents.timeLeft}
            rating={contents.rating}
            key={item.id}
            image={item.image}
            name={item.name}
            price={item.totalPrice}
            description={item.description}
          />
        ))}
      </div> */}