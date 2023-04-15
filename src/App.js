import React, {useState} from "react";
import Cover from "./components/Cover";
import './App.css';
import Wallet from "./components/Wallet";
import {Container, Nav} from "react-bootstrap";
import Acceptchallenge from "./components/rps/accept_challenge";
import Challenge from "./components/rps/challenge";
import Playreveal from "./components/rps/play";
import Deploy from "./components/rps/deploy";
import {Notification} from "./components/utils/Notifications";
import coverImg from "./assets/img/rock-paper-scissors-neon-icons-vector.jpeg"
import {indexerClient,connector} from "./utils/constants";
import {Routes, Route} from 'react-router-dom';
import {Appid} from "./utils/rpsgame";

const App = function AppWrapper() {

  const [address, setAddress] = useState(null);
  const [name, setName] = useState(null);
  const [balance, setBalance] = useState(0);


  const fetchBalance = async (accountAddress) => {
      indexerClient.lookupAccountByID(accountAddress).do()
          .then(response => {
              const _balance = response.account.amount;
              setBalance(_balance);
          })
          .catch(error => {
              console.log(error);
          });
  };

  const connectWallet =  async() => {
      if (!connector.connected) {
          connector.createSession();
        }
      connector.on("connect", (error, payload) => {
          if (error) {
            throw error;
          }
          const { accounts } = payload.params[0];
          setAddress(accounts[0]);
          setName(accounts[0]);
          fetchBalance(accounts[0]);
        });
  }


  const disconnect = () => {
      connector.on("disconnect", (error, payload) => {
          if (error) {
            throw error;
          }
        });
      setAddress(null);
      setName(null);
      setBalance(null);
      connector.killSession();
  };
  const Main = () => (
    <Routes>
      <Route path='/' element={<Deploy   address={address} fetchBalance={fetchBalance}/>}></Route>
      <Route path='/challenge' element={<Challenge  address={address} fetchBalance={fetchBalance} appid={Appid[0]}/>}></Route>
      <Route path='/accept_challenge' element={<Acceptchallenge  address={address} fetchBalance={fetchBalance} appid={Appid[0]}/>}></Route>
      <Route path='/play' element={<Playreveal  address={address} fetchBalance={fetchBalance}/>}></Route>
    </Routes>
  );
return (
  <>
      <Notification />
      {address ? (
          <Container fluid="md">
              <Nav className="justify-content-end pt-3 pb-5">
                  <Nav.Item>
                      <Wallet
                          address={address}
                          name={name}
                          amount={balance}
                          disconnect={disconnect}
                          symbol={"ALGO"}
                      />
                  </Nav.Item>
              </Nav>
              <Main />
          </Container>
      ) : (
          <Cover name={"Rock paper scissors"} coverImg={coverImg} connect={connectWallet}/>
      )}
  </>
);
}

export default App;

