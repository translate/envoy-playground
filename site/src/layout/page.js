
import React from 'react';

import Yaml from 'js-yaml';

import EnvoyInverseLogo from '../app/images/logo-inverse.svg';
import EnvoyLogo from '../app/images/logo.svg';
import DockerIcon from '../app/images/docker.svg';
import GithubLogo from '../app/images/github.svg';
import LinkIcon from '../app/images/link.svg';
import ServiceIcon from '../app/images/service.png';
import PlaygroundScreenshot from '../app/images/playground.png';

import ServiceConfig from '../services.yaml';

import PropTypes from 'prop-types';
import exact from 'prop-types-exact';

import {
    Button, Col, Collapse, ListGroup, ListGroupItem,
    Nav, Navbar, NavbarBrand, NavItem, NavLink,
    Row} from 'reactstrap';


export class PlaygroundSiteRepository extends React.PureComponent {
    static propTypes = exact({
        repository: PropTypes.string.isRequired,
    });

    render () {
        const {repository} = this.props;
        return (
            <>
              <NavLink href={repository} className="m-0 p-0">
                <img src={GithubLogo} width="18px" className="ml-1 mr-2" alt="Github" />
                code
              </NavLink>
            </>
        );
    }
}


export class PlaygroundSiteRepoEvent extends React.PureComponent {

    render () {
        const {event} = this.props;
        const {actor, payload} = event;
        const {avatar_url, login} = actor;
        const {action} = payload;
        return  (
            <ul>
              <li>
                <img src={avatar_url} width="22px" className="ml-1 mr-2" alt="Playground" />
                {login} {action} something...
              </li>
            </ul>
        );
    }
}


export class PlaygroundSiteService extends React.Component {

    state = {open: false};

    onClick = () => {
        const {open} = this.state;
        this.setState({open: !open});
    }

    render () {
        const {open} = this.state;
        const {name, data} = this.props;
        const  {image, labels} = data;
        const logo = `/services/${name}/${labels['envoy.playground.logo']}`;
        return  (
            <>
              <dt className="bg-dark p-2" onClick={this.onClick}>
                <img src={logo} width="22px" className="ml-1 mr-2" alt={name} />
                {labels['envoy.playground.service']}
              </dt>
              <Collapse className="p-2" tag='dd' isOpen={open}>
                {labels['envoy.playground.description']}
                <ListGroup className="bg-dark">
                  <ListGroupItem className="bg-dark" tag="a" href="#">
                    <img src={DockerIcon} width="22px" className="ml-1 mr-2" alt="Playground" />
                    {image}
                  </ListGroupItem>
                </ListGroup>
              </Collapse>
            </>
        );
    }
}


export class PlaygroundSiteServices extends React.Component {
    state = {services: {}};

    async componentDidMount () {
        const response = await fetch(ServiceConfig);
        const content = await response.text();
        const {services} = Yaml.safeLoad(content);
        this.setState({services});
    }

    render () {
        const {services} = this.state;
        return  (
            <dl className="p-2 pt-4 small">
              {Object.entries(services).map(([k, v], i) => {
                  return (
                      <PlaygroundSiteService key={i} name={k} data={v}  />);
              })}
            </dl>
        );
    }
}


export class PlaygroundSiteRepoInfo extends React.Component {
    static propTypes = exact({
        repository: PropTypes.string.isRequired,
    });

    state = {issues: 0, events: [], showAll: false}

    async componentDidMount () {

        const response = await fetch('https://api.github.com/repos/envoyproxy/playground');
        const content = await response.json();
        const {events_url, open_issues_count: issues} = content;
        const eventsResponse = await fetch(events_url);
        const events = await eventsResponse.json();
        this.setState({
            events,
            issues});
    }

    showMore = () => {
        this.setState({showAll: true});
    }

    render () {
        const {showAll, issues, events} = this.state;
        const {repository} = this.props;
        const _events = [...events];
        if (!showAll) {
            _events.length = 5;
        }
        return (
            <div  className="p-2 pt-4">
              <dl className="p-2">
                <dt>Repository</dt>
                <dd>
                  {repository}
                </dd>
                <dd>
                  issues: {issues}
                </dd>
                <dt>Recent activity</dt>
                <dd>
                  {_events.map((event, i) => {
                      return (
                          <PlaygroundSiteRepoEvent
                            event={event} />);
                  })}
                  {!showAll &&
                   <Button onClick={this.showMore}>Show more...</Button>
                  }
                </dd>
              </dl>
            </div>
        );
    }
}


export class PlaygroundSiteDocs extends React.PureComponent {
    render () {
        return (
            <>
              <NavLink href="/docs" className="m-0 p-0">
                docs
              </NavLink>
            </>
        );
    }
}


export class PlaygroundSiteLogotype extends React.PureComponent {

    render () {
        const {title} = this.props;
        return (
            <NavbarBrand
              className="pt-0 pb-0 mt-0 mb-0"
              to="/">
              <img
                alt="Envoy"
                src={EnvoyInverseLogo}
                width="28px"
                className="ml-1 mr-2" />
              <span>{title}</span>
            </NavbarBrand>
        );
    }
}


export class PlaygroundPageNav extends React.PureComponent {
    static propTypes = exact({
        navs: PropTypes.array.isRequired,
        tag: PropTypes.string,
        className: PropTypes.string,
    });

    render () {
        const {className='', navs, tag} = this.props;
        return (
            <Navbar
              tag={tag}
              className={"col p-0 pl-1 mt-0 mb-0 bg-dark " + className}>
              <Nav className="container-fluid">
                {navs.map(([width, nav], i) => {
                    const className = "col-sm-" + width + " pl-0";
                    return (
                        <NavItem
                          key={i}
                          className={className}>
                          {nav}
                        </NavItem>);
                })}
              </Nav>
            </Navbar>
        );
    }
}


export default class PlaygroundPage extends React.PureComponent {

    repository = "https://github.com/envoyproxy/playground";

    get navs () {
        return [
            [3, <PlaygroundSiteLogotype title="Envoy proxy Playground" />],
            [1, <PlaygroundSiteRepository repository={this.repository} />],
            [2, <PlaygroundSiteDocs />],
            [6, '']];
    }

    render () {
        return (
            <div className="App">
              <header className="App-header">
                <PlaygroundPageNav
                  tag="header"
                  className="border-bottom border-dark"
                  navs={this.navs} />
              </header>
              <main className="App-main container-fluid pt-3">
		<Row>
		  <Col>
                    <section className="mt-3">
                      <header className="bg-dark p-2">
                        <img src={EnvoyInverseLogo} width="22px" className="ml-1 mr-2" alt="Playground" />
                        Playground
                      </header>
                      <div className="p-2 pt-4 row">
                        <div className="reflection-box">
                          <div className="no-reflection" style={{backgroundImage: `url(${PlaygroundScreenshot})`}}/>
                        </div>
                      </div>
                      <div className="p-2 pt-0 row">
                        <div className="col pt-5">
                          <ListGroup className="bg-dark small text-center" horizontal>
                            <ListGroupItem className="bg-dark" tag="span" href="#">Learn/test Envoy config</ListGroupItem>
                            <ListGroupItem className="bg-dark" tag="span" href="#">Test Envoy with upstream services</ListGroupItem>
                            <ListGroupItem className="bg-dark" tag="span" href="#">Model network/proxy architectures</ListGroupItem>
                          </ListGroup>
                        </div>
                      </div>
                    </section>
		  </Col>

		  <Col>
                    <section className="mt-3">
                      <header className="bg-dark p-2">
                        <img src={LinkIcon} width="22px" className="ml-1 mr-2 rotate-90" alt="Links" />
                        Useful links
                      </header>
                      <dl className="p-2 pt-4 small">
                        <dt><img src={EnvoyInverseLogo} width="18px" className="ml-1 mr-2" alt="Playground" /> Playground</dt>
                        <dd className="p-2">
                          <ListGroup className="bg-dark">
                            <ListGroupItem className="bg-dark" tag="a" href="#">Install</ListGroupItem>
                            <ListGroupItem className="bg-dark" tag="a" href="#">Learn</ListGroupItem>
                            <ListGroupItem className="bg-dark" tag="a" href="#">Contribute</ListGroupItem>
                          </ListGroup>
                        </dd>
                        <dt><img src={EnvoyLogo} width="18px" className="ml-1 mr-2" alt="Envoy" /> Envoy proxy</dt>
                        <dd className="p-2">
                          <ListGroup className="bg-dark">
                            <ListGroupItem className="bg-dark" tag="a" href="#">Web</ListGroupItem>
                            <ListGroupItem className="bg-dark" tag="a" href="#">Code</ListGroupItem>
                            <ListGroupItem className="bg-dark" tag="a" href="#">Docs</ListGroupItem>
                          </ListGroup>
                        </dd>
                     </dl>
                    </section>
		  </Col>
	        </Row>

		<Row>
		  <Col>
                    <section className="mt-3">
                      <header className="bg-dark p-2">
                        <img src={GithubLogo} width="22px" className="ml-1 mr-2" alt="Github" />
                        Code
                      </header>
                      <PlaygroundSiteRepoInfo
                        repository={this.repository} />
                    </section>
		  </Col>

		  <Col>
                    <section className="mt-3">
                      <header className="bg-dark p-2">
                        <img src={ServiceIcon} width="22px" className="ml-1 mr-2" alt="Playground" />
                        Playground services
                      </header>
                      <PlaygroundSiteServices
                        repository="https://github.com/envoyproxy/playground" />
                    </section>
		  </Col>
	        </Row>
              </main>
            </div>);
    }
}
