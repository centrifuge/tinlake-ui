import React from 'react';
import { Box, Button, Image, Text, Anchor, ResponsiveContext } from 'grommet';
import { Menu as MenuIcon, User as UserIcon, Close as CloseIcon } from "grommet-icons";
import { connect } from 'react-redux';
import Link from 'next/link';
import { AuthState } from '../../ducks/auth';
import { formatAddress } from '../../utils/formatAddress';
import config from '../../config';
import { authTinlake } from '../../services/tinlake';
import Router from 'next/router';
import { NavBar } from '@centrifuge/axis-nav-bar';


const { isDemo } = config;
export interface MenuItem {
  label: string;
  route: string;
  secondary?: boolean;
}

interface HeaderProps {
  selectedRoute: string;
  menuItems: MenuItem[];
  auth?: AuthState;
}

class Header extends React.Component<HeaderProps> {

  constructor(props: HeaderProps) {
    super(props);
    this.state = {
      chosenRoute: '/'
    };
  }

  connectAccount = async () => {
    try {
      await authTinlake();
    } catch (e) {
      console.log(`authentication failed with Error ${e}`);
    }
  }


  render() {
    const { selectedRoute, menuItems, auth } = this.props;
    const user = auth && auth.user;
    const address = user && user.address;
    const network = auth && auth.network;

    const itemGap = 'small';
    const logoUrl = isDemo && '/static/demo_logo.svg' || '/static/logo.svg';

    const onRouteClick = (route: string) => {
      this.setState({ chosenRoute: route });
      if (route.startsWith('/')) {
        Router.push(route);
      } else {
        window.open(route);
      }
    };
    const theme = {
      navBar: {
        icons: {
          menu: MenuIcon,
          close: CloseIcon,
          user: UserIcon
        }
      }
    };

    return <Box
      style={{ position: 'sticky', top: 0, height: '90px', zIndex: 1 }}
      background="white"
      border={{ side: 'bottom', color: 'light-4' }}
      justify="center"
      align="center"
      direction="row"
      fill="horizontal"
      pad={{horizontal: "small"}}
    >
      <ResponsiveContext.Consumer>{size => size === "large" ? (

        <Box direction="row" width="xlarge" align="center" >
          <Box align="center" direction="row" basis="full" >
            <Link href="/">
              <a title="Tinlake"><Image src={logoUrl} style={{ width: 130 }} /></a>
            </Link>
            <Box fill={false} basis="full">
              <NavBar
                border={false}
                theme={theme}
                menuItems={menuItems.filter(item => {
                  return (
                    user
                    && (isDemo && item.env === "demo" || item.env === "")
                    && !item.secondary
                  )
                }
                )}
                overlayWidth="100vw"
                selectedRoute={selectedRoute}
                onRouteClick={
                  (item: MenuItem) => {
                    onRouteClick(item.route);
                  }
                }
              />
            </Box>
          </Box>
          <Box direction="row" basis="full">
            {!user && 
              <Box direction="column" align="end" basis="full" alignSelf="center">
               <Button onClick={this.connectAccount} label="Connect" />
              </Box>
            }
            {user &&
              <Box direction="column" align="end" basis="full">
                <Box direction="row" gap={itemGap} align="center" justify="start">
                  <Text> {formatAddress(address || '')} </Text>
                </Box>
                <Box direction="row" justify="start" >
                  {network && <Text style={{ color: '#808080', lineHeight: '12px', fontSize: '12px' }}> Connected to {network} </Text>}
                </Box>
              </Box>
            }
            {isDemo &&
              <Box pad={{ left: "small" }} alignSelf="center"> <Anchor href="https://centrifuge.hackmd.io/zRnaoPqfS7mTm9XL0dDRtQ?view" target="blank" label="Help" style={{ textDecoration: 'none', fontWeight: 900 }} /> </Box>
            }</Box>
        </Box>
      )
        : (
          <Box direction="row" width="xlarge" align="center">
            <Box align="center" direction="row" basis="full" >
              <Link href="/">
                <a title="Tinlake"><Image src={logoUrl} style={{ width: 130 }} /></a>
              </Link>
            </Box>
            <Box direction="row" basis="full" >
            {!user && 
              <Box direction="column" align="end" basis="full" alignSelf="center">
               <Button onClick={this.connectAccount} label="Connect" />
              </Box>
            }
            {user &&
            <Box direction="column" align="end" basis="full" alignSelf="center">
              <Box direction="row" gap={itemGap} align="center" justify="start">
                <Text> {formatAddress(address || '')} </Text>
              </Box>
              <Box direction="row" justify="start" >
                {network && <Text style={{ color: '#808080', lineHeight: '12px', fontSize: '12px' }}> Connected to {network} </Text>}
              </Box>
            </Box>
            }
            {isDemo &&
              <Box margin={{ horizontal: "small" }} alignSelf="center"> <Anchor href="https://centrifuge.hackmd.io/zRnaoPqfS7mTm9XL0dDRtQ?view" target="blank" label="Help" style={{ textDecoration: 'none', fontWeight: 900 }} /> </Box>
            }
              
              <Box fill={false}>
                <NavBar
                  border={false}
                  theme={theme}
                  menuItems={menuItems.filter(item => {
                    return (
                      user
                      && (isDemo && item.env === "demo" || item.env === "")
                      && !item.secondary
                    )
                  }
                  )}
                  overlayWidth="100vw"
                  selectedRoute={selectedRoute}
                  onRouteClick={
                    (item: MenuItem) => {
                      onRouteClick(item.route);
                    }
                  }
                />
              </Box>
            </Box>
           
          </Box>
        )}</ResponsiveContext.Consumer> </Box>;
  }
}

export default connect(state => state)(Header);
