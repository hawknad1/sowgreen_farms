import { NextRequest } from "next/server"

// export async function GET() {
//   const templateMap = process.env.TWILIO_TEMPLATE_MAP_JSON

//   return new Response(
//     JSON.stringify({
//       TWILIO_TEMPLATE_MAP_JSON: templateMap,
//       exists: !!templateMap,
//     }),
//     {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     }
//   )
// }

export async function GET() {
  const encoded = process.env.TWILIO_TEMPLATE_MAP_BASE64

  let parsed = null

  try {
    const json = Buffer.from(encoded || "", "base64").toString("utf-8")
    parsed = JSON.parse(json)
  } catch (err) {
    console.error("Failed to decode or parse base64 JSON:", err)
  }

  return new Response(
    JSON.stringify({
      exists: !!parsed,
      parsed,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  )
}

// console.log(
//   Buffer.from(
//     JSON.stringify({
//       "14var": "HX6435b0695a4a0421350e2b5d4a66d038",
//       "14var_btn": "HXc536e79c581ab48447a2197063667f8f",
//       "15var": "HX9d7972f796060c86a4040f2cf46635b7",
//       "16var": "HX710e906ed824a2b992751d840da94762",
//       "17var": "HX865f9e52a710e9a397a85eb669b9c69d",
//       "18var": "HXbe3093b99ea27660e6ef22e0aa021990",
//       "19var": "HXb6071b91717519bcd90f5551db1c008c",
//       "20var": "HXc3e03f40cb4a8836f0a516782e785994",
//       "21var": "HX3cb16b7f28580c07ca72a33a53627c08",
//       "22var": "HX10815108145b3c6b2d3e99f31fa8a0d6",
//       "23var": "HX47f5467d55da841f7f045de21dd1e164",
//       "24var": "HX58e515dddacceb98a66799f10aef11b0",
//       "25var": "HX21ae4107111cfd2852a0dc6d17c4a334",
//       "26var": "HX88b1ccb617bf5e087255207dc6dc0567",
//       "27var": "HX100cac0381a2fdba4d564cd912f628c3",
//       "28var": "HX71d3bd4e220de0e71bab44dcc95db5d1",
//       "29var": "HXe1d51d1ecaa8725ee2578c056500b19c",
//       "30var": "HXdaf0b599266492873df0a585b9e27fba",
//       "31var": "HX3b3d008e83ccb48e687224d652d665a2",
//       "32var": "HXb37c92b362f4126cb65bb687cb0ce70d",
//       "33var": "HX1db5b20fbd2977e170d0296a1f5919e6",
//       full_product_list: "HXee8aaff32f6965b947ee2fa507948302",
//     })
//   ).toString("base64")
// )

console.log(
  Buffer.from(
    JSON.stringify({
      "15var": "HXa265fa1e7d813706a8da87a77179c41a",
      "15var_btn": "HX9a6e5b58fceef3a082bd3c6fe3995211",
      "16var": "HX9543f23893361e38a26eb9ad3e1e6434",
      "17var": "HX07c0939332e3fb413d8217be3376a60b",
      "18var": "HX6e54dbe8cf4cb89f70df405a6e08a960",
      "19var": "HX6d9f0e7a6776fbdc41c381546c373644",
      "20var": "HX9f71a67a29d9b4cfa424d6455e702e56",
      "21var": "HX84c9ad6fc14ba6865ab2f10a284125b8",
      "22var": "HX49f5317ce2e217ab5ec7296a2b33ef8f",
      "23var": "HX0bceaba0819f7fd96009f6b4e1f8058e",
      "24var": "HX912fed275abc5dd408421121c6a77e9c",
      "25var": "HX018ef9569a813739edd4481beca9402b",
      "26var": "HX6d80c906d33020ba770f06ddfd23fe1e",
      "27var": "HX178ab9e88819ce9529e1eab91f516ec4",
      "28var": "HX71e8b6328ce542720463533ed9547de3",
      "29var": "HXf043069dd538b81fa511ae7e608ee8dd",
      "30var": "HX771e6b9711cb8dfca09529271a8bc141",
      "31var": "HX7b7bcf269fe4a8b36b3a67f1f360e435",
      "32var": "HX6a5575f717da8f35b9f42257d17614b6",
      "33var": "HX15214334f64ad042ff9b0eeae15ebd27",
      "34var": "HX93607c69a07cf1186762fa5ca4b89417",
      full_product_list: "HXee8aaff32f6965b947ee2fa507948302",
    })
  ).toString("base64")
)
