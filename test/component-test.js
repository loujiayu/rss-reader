import React from 'react';
import ReactDOM from 'react-dom';
import {renderIntoDocument} from 'react-addons-test-utils';
import { expect} from 'chai';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import { SearchPanel, Login, ContentPenal, Column, FeedTab } from 'components';
import createStore from 'redux/create';
import ApiClient from 'helpers/ApiClient';
const client = new ApiClient();

describe('component', () => {
  describe('ContentPenal', () => {
    function ContentPenalInit(mockStore) {
      const store = createStore(browserHistory, client, mockStore);
      const renderer = renderIntoDocument(
        <Provider store={store} key="provider">
          <ContentPenal />
        </Provider>
      );
      const dom = ReactDOM.findDOMNode(renderer);
      return {dom:dom, renderer: renderer}
    }
    var mockStore = {
      manage: {
        contents: [
          {
            rd: false,
            st: false,
            _id: '123456',
            pub: 1456727194546,
            tt: 'css article',
            fnm: 'css',
            con: 'content...'
          }
        ],
        entryIndex: 0
      },
      auth: {
        user: 'test'
      }
    }
    const {dom, renderer} = ContentPenalInit(mockStore)
    it('should render correctly', () => {
      return expect(renderer).to.be.ok
    })
  })
  describe('Column', () => {
    function ColumnInit(mockStore) {
      const store = createStore(browserHistory, client, mockStore);
      const renderer = renderIntoDocument(
        <Provider store={store} key="provider">
          <Column />
        </Provider>
      );
      const dom = ReactDOM.findDOMNode(renderer);
      return {dom:dom, renderer: renderer}
    }
    var mockStore = {
      manage: {
        contents: [
          {
            rd: false,
            st: false,
            _id: '123456',
            pub: 1456727194546,
            tt: 'css article',
            fnm: 'css',
            con: 'content...'
          }
        ],
        selected: ['css', 0],
        entryIndex: 0
      },
      stat: {
        status: 'unread'
      },
      auth: {
        user: 'test'
      }
    }
    const {dom, renderer} = ColumnInit(mockStore)
    it('should render correctly', () => {
      return expect(renderer).to.be.ok
    })
    it('should render correct content', () => {
      const children = dom.getElementsByTagName('li')[0].childNodes
      const mockContent = mockStore.manage.contents[0]
      expect(children[1].textContent).to.equal(mockContent.tt)
      expect(children[2].textContent).to.equal(mockContent.con)
      expect(children[3].textContent).to.equal(mockContent.fnm)
    })
    it('correct data-type', () => {
      const s = dom.getElementsByTagName('span')[0].dataset.type
      expect(s).to.equal('starred')
    })
  })
  describe('SearchPanel', () => {
    function SearchPanelInit(mockStore) {
      const store = createStore(browserHistory, client, mockStore);
      const renderer = renderIntoDocument(
        <Provider store={store} key="provider">
          <SearchPanel />
        </Provider>
      );
      const dom = ReactDOM.findDOMNode(renderer);
      return {dom:dom, renderer: renderer}
    }
    describe('loading', () => {
      var mockStore = {
        feedly: {
          loading: true,
          loaded: false,
          closed: false
        },
        auth: {
          user: 'test'
        }
      }
      const {dom, renderer} = SearchPanelInit(mockStore)
      it('should render correctly', () => {
        return expect(renderer).to.be.ok
      })
      it('should render correct value', () => {
        const text = dom.getElementsByTagName('ul')[0].childNodes[0].textContent
        expect(text).to.equal('LOADING')
      })
    })
    describe('loaded', () => {
      var mockStore = {
        auth: {
          user: 'test'
        },
        feedly: {
          closed: false,
          loading: false,
          loaded: true,
          data: {
            results: [
              {
                website: 'https://www.google.com/s2/favicons?domain=css-tricks.com&alt=feed',
                title: 'css-tricks',
                description: 'web design'
              }
            ]
          }
        }
      }
      const {dom, renderer} = SearchPanelInit(mockStore)
      it('should render correctly', () => {
        return expect(renderer).to.be.ok
      })
      it('should render correct value', () => {
        const text = dom.getElementsByTagName('p')[0].textContent
        expect(text).to.equal(mockStore.feedly.data.results[0].description)
      })
    })
  })
})
