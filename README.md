An ERC-20 V1 token was deployed through a Transparent Proxy on Base Sepolia; 10 MTK were minted through the proxy ([mint](https://sepolia.basescan.org/tx/0x9e9823578acb72afe10ac012019a47136899d060c5e503b48c71042e534c9a5c)) and 3 MTK were transferred ([transfer](https://sepolia.basescan.org/tx/0x3bbe8664129fd6f977bd96b49c30a3ccf5b246ceaaebf651a90eaafc813099d7)), after which the proxy was upgraded to V2 ([upgrade](https://sepolia.basescan.org/tx/0x89869986f5cd5e6ce94b14332a888f2b7525246de8f12aadf8e82b1389dbefc5)); balances were preserved at 1,000,007 MTK for the owner and 3 MTK for the recipient, and `version()` returns `V2`. 

version() = V2
<img width="1911" height="1026" alt="download" src="https://github.com/user-attachments/assets/693eb354-c23c-4a2b-8ebf-f58816ed49a3" />

The balance of the owner after the update is 1000007 MTK
<img width="1916" height="1014" alt="download (1)" src="https://github.com/user-attachments/assets/fcbc525e-d9b5-4434-91ed-0f5ef219b304" />

The recipient's balance after the update is 3 MTK
<img width="1887" height="1010" alt="download (2)" src="https://github.com/user-attachments/assets/61036f5d-44ed-4a4f-9839-b8d1dbbc8819" />
