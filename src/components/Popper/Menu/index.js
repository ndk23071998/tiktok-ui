import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import MenuItem from './MenuItem';

import styles from './Menu.module.scss';
import { Wrapper as PopperWrapper } from '~/components/Popper';

const cx = classNames.bind(styles);

function Menu({ children, items = [] }) {
    const renderItems = () => {
        return items.map((item, index) => <MenuItem key={index} data={item} />);
    };

    return (
        <Tippy
            render={(attrs) => (
                <div className={cx('menu-list')} tabIndex="-1" {...attrs}>
                    <PopperWrapper>{renderItems()}</PopperWrapper>
                </div>
            )}
            visible="true"
            interactive="true"
            placement="bottom-end"
        >
            {children}
        </Tippy>
    );
}

export default Menu;
