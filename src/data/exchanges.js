export const exchangeToAddressMap = new Map([
[
    "Binance_hot", 
    "5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9"
],
[
    "binance_cold", 
    "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"
],
[
    "bybit", 
    "AC5RDfQFmDS1deWZos921JfqscXdByf8BKHs5ACWjtW2"
],
[
    "coinbase", 
    "H8sMJSCQxfKiFTCfDR3DUMLPwcRbM61LGFJ8N4dK3WjS"
],
[  
    "coinbase2", 
    "2AQdpHJ2JpcEgPiATUXjQxA8QmafFegfQwSLWSprPicm"
],
[   
    "crypto_com_1", 
    "6FEVkH17P9y8Q9aCkDdPcMDjvj7SVxrTETaYEm8f51Jy"
],
[
    "crypto_com_2", 
    "AobVSwdW9BbpMdJvTqeCN4hPAmh4rHm7vwLnQ5ATSyrS"
],
[
    "gate_io", 
    "u6PJ8DtQuPFnfmwHbGFULQ4u4EgjDiyYKjVEsynXq2w"
],
[
    "OKX", 
    "5VCwKtCXgCJ6kit5FybXjvriW3xELsFDhYrPSqtJNmcD"
],
[
    "huobi", 
    "88xTWZMeKfiTgbfEmPLdsUCQcZinwUfk25EBQZ21XMAZ"
],
[
    "kraken", 
    "FWznbcNXWQuHTawe9RxvQ2LdCENssh12dsznf4RiouN5"
],
[
    "mexc", 
    "ASTyfSima4LLAdDgoFGkgqoKowG1LZFDr9fAQrg7iaJZ"
]
]);

// export const exchangeToAddressMap = new Map();
// exchangeToAddressMap.set(
//     "Binance_hot", 
//     "5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9"
// );
// exchangeToAddressMap.set(
//     "binance_cold", 
//     "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"
// );
// exchangeToAddressMap.set(
//     "bybit", 
//     "AC5RDfQFmDS1deWZos921JfqscXdByf8BKHs5ACWjtW2"
// );
// exchangeToAddressMap.set(
//     "coinbase", 
//     "H8sMJSCQxfKiFTCfDR3DUMLPwcRbM61LGFJ8N4dK3WjS"
// );
// exchangeToAddressMap.set(
//     "coinbase2", 
//     "2AQdpHJ2JpcEgPiATUXjQxA8QmafFegfQwSLWSprPicm"
// );
// exchangeToAddressMap.set(
//     "crypto_com_1", 
//     "6FEVkH17P9y8Q9aCkDdPcMDjvj7SVxrTETaYEm8f51Jy"
// );
// exchangeToAddressMap.set(
//     "crypto_com_2", 
//     "AobVSwdW9BbpMdJvTqeCN4hPAmh4rHm7vwLnQ5ATSyrS"
// );
// exchangeToAddressMap.set(
//     "gate_io", 
//     "u6PJ8DtQuPFnfmwHbGFULQ4u4EgjDiyYKjVEsynXq2w"
// );
// exchangeToAddressMap.set(
//     "OKX", 
//     "5VCwKtCXgCJ6kit5FybXjvriW3xELsFDhYrPSqtJNmcD"
// );
// exchangeToAddressMap.set(
//     "huobi", 
//     "88xTWZMeKfiTgbfEmPLdsUCQcZinwUfk25EBQZ21XMAZ"
// );
// exchangeToAddressMap.set(
//     "kraken", 
//     "FWznbcNXWQuHTawe9RxvQ2LdCENssh12dsznf4RiouN5"
// );
// exchangeToAddressMap.set(
//     "mexc", 
//     "ASTyfSima4LLAdDgoFGkgqoKowG1LZFDr9fAQrg7iaJZ"
// );



export const addressToExchangeMap = new Map();
addressToExchangeMap.set(
  "5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9",
  "Binance_hot"
);
addressToExchangeMap.set(
  "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
  "binance_cold"
);
addressToExchangeMap.set(
    "AC5RDfQFmDS1deWZos921JfqscXdByf8BKHs5ACWjtW2", 
    "bybit"
);
addressToExchangeMap.set(
  "H8sMJSCQxfKiFTCfDR3DUMLPwcRbM61LGFJ8N4dK3WjS",
  "coinbase"
);
addressToExchangeMap.set(
  "2AQdpHJ2JpcEgPiATUXjQxA8QmafFegfQwSLWSprPicm",
  "coinbase2"
);
addressToExchangeMap.set(
  "6FEVkH17P9y8Q9aCkDdPcMDjvj7SVxrTETaYEm8f51Jy",
  "crypto_com_1"
);
addressToExchangeMap.set(
  "AobVSwdW9BbpMdJvTqeCN4hPAmh4rHm7vwLnQ5ATSyrS",
  "crypto_com_2"
);
addressToExchangeMap.set(
  "u6PJ8DtQuPFnfmwHbGFULQ4u4EgjDiyYKjVEsynXq2w",
  "gate_io"
);
addressToExchangeMap.set(
    "5VCwKtCXgCJ6kit5FybXjvriW3xELsFDhYrPSqtJNmcD", 
    "OKX"
);
addressToExchangeMap.set(
    "88xTWZMeKfiTgbfEmPLdsUCQcZinwUfk25EBQZ21XMAZ", 
    "huobi"
);
addressToExchangeMap.set(
  "FWznbcNXWQuHTawe9RxvQ2LdCENssh12dsznf4RiouN5",
  "kraken"
);
addressToExchangeMap.set(
    "ASTyfSima4LLAdDgoFGkgqoKowG1LZFDr9fAQrg7iaJZ", 
    "mexc"
);