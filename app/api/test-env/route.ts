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
//       "15var": "HXa265fa1e7d813706a8da87a77179c41a",
//       "15var_btn": "HX9a6e5b58fceef3a082bd3c6fe3995211",
//       "16var": "HX9543f23893361e38a26eb9ad3e1e6434",
//       "17var": "HX07c0939332e3fb413d8217be3376a60b",
//       "18var": "HX6e54dbe8cf4cb89f70df405a6e08a960",
//       "19var": "HX6d9f0e7a6776fbdc41c381546c373644",
//       "20var": "HX9f71a67a29d9b4cfa424d6455e702e56",
//       "21var": "HX84c9ad6fc14ba6865ab2f10a284125b8",
//       "22var": "HX49f5317ce2e217ab5ec7296a2b33ef8f",
//       "23var": "HX0bceaba0819f7fd96009f6b4e1f8058e",
//       "24var": "HX912fed275abc5dd408421121c6a77e9c",
//       "25var": "HX018ef9569a813739edd4481beca9402b",
//       "26var": "HX6d80c906d33020ba770f06ddfd23fe1e",
//       "27var": "HX178ab9e88819ce9529e1eab91f516ec4",
//       "28var": "HX71e8b6328ce542720463533ed9547de3",
//       "29var": "HXf043069dd538b81fa511ae7e608ee8dd",
//       "30var": "HX771e6b9711cb8dfca09529271a8bc141",
//       "31var": "HX7b7bcf269fe4a8b36b3a67f1f360e435",
//       "32var": "HX6a5575f717da8f35b9f42257d17614b6",
//       "33var": "HX15214334f64ad042ff9b0eeae15ebd27",
//       "34var": "HX93607c69a07cf1186762fa5ca4b89417",
//       full_product_list: "HXee8aaff32f6965b947ee2fa507948302",
//     })
//   ).toString("base64")
// )

// pickup--

console.log(
  Buffer.from(
    JSON.stringify({
      "13var": "HXb72fdbeb151e9154c38ab74a126252da",
      "13var_btn": "HX362337c29011fc81bf849a8436521606",
      "14var": "HX6d889cebd2853e92b94b8dc88480d5aa",
      "15var": "HXb730bb0fb673dbdd84a764f545474f4c",
      "16var": "HXa32d5d36e1ad6a279c3df6f1c25bf760",
      "17var": "HXcc8396c8d068519e37910acb3d5b189f",
      "18var": "HX00bd7bbb6385546a2953979a6b592486",
      "19var": "HX9fc4b819f930a3dc2769b88d5793b977",
      "20var": "HX065dbb6ff05cf614467437a0d700a85b",
      "21var": "HXcd828993edbb2c4853a05d66f1ab9d92",
      "22var": "HXc55322e9011de11874c1949e00f4a25f",
      "23var": "HX62a21a7152e36af50d1f9189ab3d2746",
      "24var": "HX1ff7ad03a36e023af2507a8b75ddea76",
      "25var": "HXab46f0074683c634bc9c0e7e2afdaf53",
      "26var": "HX4ee27572f6cff551fe405f076eca081e",
      "27var": "HX61174401ad896e05432f028332bb1277",
      "28var": "HXf3977d8f42a98c5e64efe8594d66ba2a",
      "29var": "HXc67f453dc8e9d97c9bab7271c8553add",
      "30var": "HX04bdf152a5c59e220b87c9ce9878dd42",
      "31var": "HX4b3a734603c113593487ad905fa778e3",
      "32var": "HX06652b292969bce64aaf80835db078b9",
      full_product_list: "HXee8aaff32f6965b947ee2fa507948302",
    })
  ).toString("base64")
)
