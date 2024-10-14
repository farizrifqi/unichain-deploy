"use client"
import { createContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { ethers } from "ethers";
import { CheckIcon } from "lucide-react";
import axios from "axios";
const { ethereum } = typeof window !== "undefined" ? window : {};

export const AppContext = createContext();

export default function EthereumContextProvider({ children }) {
    const [account, setAccount] = useState(null);
    const [accounts, setAccounts] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(null);
    const [loadingBy, setLoadingBy] = useState(null);

    const checkEthereumExists = () => {
        if (!ethereum) {
            toast.error("Please install Metamask")
            return false;
        }
        return true;
    };
    const getConnectedAccounts = async () => {
        try {
            const accounts = await ethereum.request({
                method: "eth_accounts",
            });

            setAccount(accounts[0] ?? null);
            setAccounts(accounts);
        } catch (err) {
            toast.error(err?.message ?? "An error has occurred while getting connected account")
        }
    };
    const deployContract = async (name, symbol, tokenDecimals, tokenSupply) => {
        setIsLoading(true)
        setLoadingBy("deployContract")
        setLoadingMessage("Compiling contract")
        try {
            setLoadingMessage("Preparing tx")
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner(account);
            const contract = new ethers.Contract("0xfe16ee9A6Bb4d3a293FD29d04d70D03751aF9de6", [
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "symbol",
                            "type": "string"
                        },
                        {
                            "internalType": "uint8",
                            "name": "decimal",
                            "type": "uint8"
                        },
                        {
                            "internalType": "uint256",
                            "name": "supply",
                            "type": "uint256"
                        }
                    ],
                    "name": "deploy",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "payable",
                    "type": "function"
                }
            ], signer)
            const createTx = await contract.deploy(name, symbol, tokenDecimals, tokenSupply, { value: 1000000000000000n })

            const receipt = await createTx.wait()
            if (receipt) {
                toast.success("Transaction successful",
                    {
                        action: {
                            label: "View on explorer",
                            onClick: () => window.open(`https://sepolia.uniscan.xyz/tx/${receipt.hash}`, "_blank")
                        },
                        icon: <CheckIcon />
                    }
                )
            } else {
                throw new Error("Transaction failed")
            }
        } catch (err) {
            if (err.info?.error?.message) {
                toast.error(err.info.error.message)
            } else if (err.message) {
                toast.error(err.message)
            } else {
                toast.error('Something wrong')
            }
        } finally {
            setLoadingMessage(null)
            setLoadingBy(null)
            setIsLoading(false)
        }
    }
    const deployContractOld = async (name, symbol, tokenDecimals, tokenSupply) => {
        setIsLoading(true)
        setLoadingBy("deployContract")
        setLoadingMessage("Compiling contract")
        try {
            const response = await axios.post("http://localhost:3001/compile", { tokenName: name, tokenSymbol: symbol, tokenDecimals, tokenSupply })
            const { abi, bytecode, error } = response.data
            if (error) {
                toast.error(error)
                return
            }
            setLoadingMessage("Preparing tx")
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner(account);
            const factory = new ethers.ContractFactory(abi, bytecode, signer);
            const contract = await factory.deploy();
            setLoadingMessage("Waiting tx")
            const receipt = await contract.deploymentTransaction().wait()
            if (receipt) {
                toast.success("Transaction successful",
                    {
                        action: {
                            label: "View on explorer",
                            onClick: () => window.open(`https://sepolia.uniscan.xyz/tx/${receipt.hash}`, "_blank")
                        },
                        icon: <CheckIcon />
                    }
                )
            } else {
                throw new Error("Transaction failed")
            }
            setLoadingMessage("Waiting tx")
        } catch (err) {
            console.log(err)

            if (err.info?.error?.message) {
                toast.error(err.info.error.message)
            } else if (err.message) {
                toast.error(err.message)
            } else {
                toast.error('Something wrong')
            }
        } finally {
            setLoadingMessage(null)
            setLoadingBy(null)
            setIsLoading(false)
        }
        return false;
    }
    const sendTx = async () => {
        setIsLoading(true)
        setLoadingBy("sendTx")
        setLoadingMessage("Preparing txs")
        if (checkEthereumExists()) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner(account);
                setLoadingMessage("Waiting request")
                const sendTx = await signer.sendTransaction({
                    to: account,
                    value: 0,
                })
                setLoadingMessage("Waiting tx")
                const receipt = await sendTx.wait()
                if (receipt) {
                    toast.success("Transaction successful",
                        {
                            action: {
                                label: "View on explorer",
                                onClick: () => window.open(`https://sepolia.uniscan.xyz/tx/${receipt.hash}`, "_blank")
                            },
                            icon: <CheckIcon />
                        }
                    )
                }

            } catch (err) {
                if (err.info?.error?.message) toast.error(err.info.error.message)
            } finally {
                setLoadingMessage(null)
                setLoadingBy(null)
                setIsLoading(false)
            }
        }
    }
    const connectWallet = async () => {
        if (checkEthereumExists()) {
            try {
                const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                if (chainId !== '0x515') {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x515' }],
                    });
                }


                const requestedaccounts = await ethereum.request({
                    method: "eth_requestAccounts",
                });
                const connectedAccount = requestedaccounts[0] ?? null;

                setAccount(connectedAccount);
                setAccounts(requestedaccounts);

            } catch (err) {
                console.error(err)
            }
        }
    };
    useEffect(() => {
        if (checkEthereumExists()) {
            ethereum.on("accountsChanged", getConnectedAccounts);
            getConnectedAccounts();
        }
        return () => {
            ethereum.removeListener("accountsChanged", getConnectedAccounts);
        };
    }, []);
    useEffect(() => {
        const requestChainId = async () => {
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (chainId !== '0x515') {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x515' }],
                });
            }
        }
        requestChainId()
    }, [])
    return (
        <AppContext.Provider value={{ account, connectWallet, accounts, setAccounts, sendTx, setIsLoading, isLoading, setLoadingMessage, loadingMessage, deployContract, loadingBy, setLoadingBy }}>
            {children}
        </AppContext.Provider>
    );
}