/* @flow */

import cx from 'classnames';
import React from 'react';

export default class View extends React.Component {
  render(): ReactElement {
    const {planet, sithList, canScrollUp, canScrollDown, onScrollUp, onScrollDown} = this.props;
    const menuItems = sithList.map((sith, i) =>
      <li
        className="css-slot" key={sith.name ? `sith_${sith.name}` : i}
        style={sith.matched ? {color: 'red'} : null}
        >
        <h3>{sith.name ? sith.name : ''}</h3>
        <h6>{sith.homeworld ? `Homeworld: ${sith.homeworld.name}` : ''}</h6>
      </li>
    ).toArray();
    return (
      <div className="css-root">
        <h1 className="css-planet-monitor">Obi-Wan currently on {planet ? planet.name : ''}</h1>

        <section className="css-scrollable-list">
          <ul className="css-slots">
            {menuItems}
          </ul>

          <div className="css-scroll-buttons">
            <button
              className={cx("css-button-up", {"css-button-disabled": !canScrollUp})}
              onClick={() => {if (canScrollUp) onScrollUp();}}
              />
            <button
              className={cx("css-button-down", {"css-button-disabled": !canScrollDown})}
              onClick={() => {if (canScrollDown) onScrollDown();}}
              />
          </div>
        </section>
      </div>
    );
  }
}
View.propTypes = {
  planet: React.PropTypes.object,
  sithList: React.PropTypes.object.isRequired,
  canScrollUp: React.PropTypes.bool.isRequired,
  canScrollDown: React.PropTypes.bool.isRequired,
  onScrollUp: React.PropTypes.func.isRequired,
  onScrollDown: React.PropTypes.func.isRequired
};
