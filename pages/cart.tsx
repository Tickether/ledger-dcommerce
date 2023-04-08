import type { NextPage } from 'next'
import { Product } from '../models/models';
import { cartState } from '../atom/cartState';
import { useRecoilState } from 'recoil'
import NavbarComponent from '../components/NavbarComponent';
import CartComponent from '../components/CartComponent';
import { BigNumber, ethers } from 'ethers';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { use, useEffect, useState } from 'react';





const CartPage : NextPage = () => {

    const [cartItem, setCartItem] = useRecoilState(cartState)
    console.log(cartItem)

    const {address, isConnected} = useAccount()

    const [tokenIDs, setTokenIDs] = useState<BigNumber[]>([])
    const [quantities, setQuantities] = useState<BigNumber[]>([])
    const [cartPrice, setCartPrice] = useState<BigNumber>()


    useEffect(() => {
        const _tokenIDs = []
        const _quantities = []
        const _values = []
        
        for (let i = 0; i < cartItem.length; i++) {
            //const total = Number(cartItem[0].price) * Number(cartItem[i].quantity)
            
             _tokenIDs.push(BigNumber.from(cartItem[i].product.tokenId))
            _quantities.push(BigNumber.from(cartItem[i].quantity)) 
            const price = (BigInt(cartItem[i].price))
            const total = (price)*(BigInt(cartItem[i].quantity))
            _values.push(total)

            console.log(BigNumber.from(price))
            console.log(cartItem[i].quantity)
            console.log(total)
        }
        const sumTotal = _values.reduce((acc: bigint, curr: bigint) => acc + curr, BigInt(0));
        //const summ = ethers.utils.parseEther((sum).toString())
        console.log(sumTotal)
        //setCartPrice(BigNumber.from((sumTotal)))
        //setCartPrice(((sum)))
        /**
        83333333333333333
        83333333333333333n 
         * */
        setCartPrice(BigNumber.from((sumTotal)))
        setTokenIDs(_tokenIDs)
        setQuantities(_quantities)
     }, []);

     console.log(tokenIDs)
     console.log(quantities)
     console.log(cartPrice)


    const  contractWrite = useContractWrite({
        mode: 'recklesslyUnprepared',
        address: "0xa2F704361FE9C37A824D704DAaB18f1b7949e8A2",
        abi: [
            {
              name: 'buyAll',
              inputs: [ {internalType: "address", name: "to", type: "address"}, {internalType: "uint256[]", name: "ids", type: "uint256[]"}, {internalType: "uint256[]", name: "amounts", type: "uint256[]" } ],
              outputs: [],
              stateMutability: 'payable',
              type: 'function',
            },
          ],
        functionName: "buyAll",
        args: [ (address!), (tokenIDs), (quantities) ],
        overrides: {
            value: cartPrice, /**ethers.utils.parseEther((cartPrice)) */
        },
        chainId: 11155111,
    })

    const handleBuy = async () => {
        try {
          await contractWrite.writeAsync?.()
        } catch (err) {
          console.log(err)
        }
    }
   

    return (
        <div className="cart">
            <NavbarComponent/>
            <div>
                {
                    cartItem.length <= 0 
                    ? <h1>your cart is empty</h1>
                    : cartItem.map(item => <CartComponent key={item.product.tokenId} product={item.product} quantity={item.quantity} price={item.price}/> )
                }
            </div>
            <div>
                <button onClick={handleBuy} disabled={!isConnected}>
                    Buy
                </button>
            </div>
        </div>
    );
}

export default CartPage;


/*
            const contractReadFee = useContractRead({
                address: "0xa2F704361FE9C37A824D704DAaB18f1b7949e8A2",
                abi: [
                    {
                      name: 'getLatestPrice',
                      inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
                      outputs: [{ internalType: "int256", name: "", type: "int256" }],
                      stateMutability: 'view',
                      type: 'function',
                    },
                    
                  ],
                functionName: 'getLatestPrice',
                args: [BigNumber.from(cartItem[i].product.tokenId)],
                chainId: 11155111,
            })
             //_value = contractReadFee.data! * (BigNumber.from(cartItem[i].quantity))  
            */