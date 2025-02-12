import { useEffect } from "react";

const ItemList = ({data,setItemData}) => {
  
  
    
    const incrementQuantity = (itemName) => {
      setItemData((prevItems) =>
        prevItems.map((item) =>
          item.name === itemName && (item.total - item.totalReservado - item.cantidad > 0)
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    };
  
    const decrementQuantity = (itemName) => {
      setItemData((prevItems) =>
        prevItems.map((item) =>
          item.name === itemName
            ? { ...item, cantidad: Math.max(item.cantidad - 1, 0) }
            : item
        )
      );
    };
  
    return (
      <div style={{ width: "100%", margin: "auto" }}>
        <label style={{color:'#424242'}}>Items for the class:</label>
        <ul style={{ listStyleType: "none", padding: 0, backgroundColor: "white" }}>
          <>
          {data.map((item) => (
            <>
            <li
              key={item.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "5px",
                color: "#424242",
              }}
            >
              
              {item.mantainance=='no'? (
                <span>
                  {item.name} ({item.id})
                </span>
              ) :
              (
                <span style={{color:'red'}}>
                  {item.name} ({item.id}) (item on manteinance)
                </span>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {item.cantidad > 0 && (
                  <button
                    onClick={() => decrementQuantity(item.name)}
                    style={{
                      padding: "5px 10px",
                      fontSize: "16px",
                      cursor: "pointer",
                      border: "none",
                      backgroundColor: "white",
                      color: "#424242",
                    }}
                  >
                    -
                  </button>
                )}
                <span
                  style={{
                    fontSize: "16px",
                    minWidth: "20px",
                    textAlign: "center",
                    color: "#424242",
                  }}
                >
                  {item.cantidad}
                </span>
                {(item.total - item.totalReservado - item.cantidad) > 0 && (
                  <button
                    onClick={() => incrementQuantity(item.name)}
                    style={{
                      padding: "5px 10px",
                      fontSize: "16px",
                      cursor: "pointer",
                      border: "none",
                      backgroundColor: "white",
                      color: "#424242",
                    }}
                  >
                    +
                  </button>
                )}
              </div>
            </li>
                   
          </>
          ))}
          </>
        </ul>
      </div>
    );
  };

export default ItemList