import './App.scss';
import { ethers } from 'ethers'
import { useEffect, useState } from 'react';
import successImg from './imgs/success.png'
import errorImg from './imgs/error.png'
import wallet from './imgs/wallet.png'
import amount from './imgs/amount.png'

function App() {
  const [accountAddress, setAccountAddress] = useState('');
  const [accountBalance, setAccountBalance] = useState('');
  const [isMobile, setIsMobile] = useState(null);
  const [proccesTransation, setProccesTransation] = useState(false);
  const [sendAddress, setSendAddress] = useState("");
  const [sendAmount, setSendAmount] = useState(0);
  const [buttonConnect, setButtonConnect] = useState('Connect Wallet');
  const [messege, setMessege] = useState("");
  const [messegeImg, setMessegeImg] = useState(successImg);


  const { ethereum } = window

  useEffect(() => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }, []);

  const getWallet = async () => {
    if (ethereum && ethereum.isMetaMask) {
      setProccesTransation(true)
      setMessege("MetaMask connecting to your wallet");
      try {
        const result = await ethereum.request({ method: 'eth_requestAccounts' })
        const chain = await ethereum.request({ method: 'net_version' })
        if (chain !== '3') { // For prodaction set to "1" (Ethereum network)
          setMessege('Change network to Ropsten Test Network.')
          return setMessegeImg(errorImg)
        }
        getAccountBalance(result[0])
        setAccountAddress(result[0])
        setProccesTransation(false)
        setButtonConnect('Connected')
      } catch (error) {
        setMessege(error.message)
        setMessegeImg(errorImg)
        setTimeout(() => { setProccesTransation(false) }, 3000)
      }
    } else if (isMobile) {
      window.open('https://metamask.app.link/dapp/earnmecrypto.github.io/metatest/', '_blank');
    } else {
      window.open('https://bit.ly/35swGNT', '_blank');
    }
  }

  const getAccountBalance = (address) => {
    ethereum.request({ method: 'eth_getBalance', params: [address, 'latest'] })
      .then(balance => {
        setAccountBalance(ethers.utils.formatEther(balance))
      })
  }

  const sendEthButton = async () => {
    if (!accountAddress) return getWallet()
    try {
      setProccesTransation(true)
      setMessege("Transaction has been creating")
      const send_Transations = await ethereum.request({
        method: `eth_sendTransaction`,
        params: [{
          to: sendAddress,
          from: accountAddress,
          value: ethers.utils.parseEther((sendAmount).toString())._hex,
          gas: '0x5208'
        }]
      })
      setMessege("Transaction has been successfuly created...")
      setTimeout(() => { setProccesTransation(false) }, 3000)
    } catch (error) {
      setMessege("Sorry, something went wrong please try again later.")
      setMessegeImg(errorImg)
      setTimeout(() => {
        setMessegeImg(successImg)
        setProccesTransation(false)
      }, 3000)
    }
  }

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  if (!isSafari) {
    ethereum.on('accountsChanged', getWallet);
    ethereum.on('chainChanged', () => {window.location.reload()});
  }

  return (
    <div className="App">
      <div className="Container">
        <div className="Transaction">
          <h1>Connect Wallet</h1>
          <div className="Amount">
            <button onClick={() => { getWallet() }}>{buttonConnect}</button>
            <span>
              <img src={wallet} alt="" />
              <h2>{accountAddress ? (accountAddress.slice(0, 6) + "........." + accountAddress.slice(-6)) : "Connect your wallet"}</h2>
            </span>
            <span>
              <img src={amount} alt="" />
              <h2>{accountBalance ? accountBalance + "ETH" : 0.0}</h2>
            </span>
          </div>
        </div>
        <div className="Info">
          <input type="text" placeholder='Address' onChange={(e) => setSendAddress(e.target.value)} />
          <input type="text" placeholder='Amount' onChange={(e) => setSendAmount(e.target.value)} />
          <button onClick={() => sendEthButton()}>Send</button>
        </div>
      </div>

      {proccesTransation ?
        <div className="CreatedTransaction">
          <img src={messegeImg} alt="" />
          <h1>{messege}</h1>
        </div>
        : null}
    </div>
  );
}

export default App;
