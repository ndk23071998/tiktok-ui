import { useEffect, useState, useRef } from 'react';
import HeadlessTippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';

import * as searchServices from '~/apiServices/searchServices';
import { SearchIcon } from '~/components/Icons';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import AccountItem from '~/components/AccountItem';
import styles from './Search.module.scss';
import { useDebounce } from '~/components/myHooks';

const cx = classNames.bind(styles);

function Search() {
    const [searchValue, setSearchValue] = useState('');

    const [searchResult, setSearchResult] = useState([]);

    const [showSearchResult, setShowSearchResult] = useState(true);

    const [showLoading, setShowLoading] = useState(false);

    const debouncedSearchValue = useDebounce(searchValue, 700);

    const inputRef = useRef();

    useEffect(() => {
        if (!debouncedSearchValue.trim()) {
            setSearchResult([]);
            return;
        }

        setShowLoading(true);

        const fetchApi = async () => {
            setShowLoading(true);

            const result = await searchServices.search(debouncedSearchValue);
            setSearchResult(result);
            setShowLoading(false);
        };

        fetchApi();
    }, [debouncedSearchValue]);

    // Handle hide search result when click outsite
    const handleHideSearchResult = () => {
        setShowSearchResult(false);
    };

    // Handle clear search input value
    const handleClear = () => {
        setSearchValue('');
        setSearchResult([]);
        inputRef.current.focus();
    };

    return (
        <HeadlessTippy
            interactive
            visible={showSearchResult && searchResult.length > 0}
            onClickOutside={handleHideSearchResult}
            render={(attrs) => (
                <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                    <PopperWrapper>
                        <h4 className={cx('search-title')}>Accounts</h4>
                        {searchResult.map((result) => (
                            <AccountItem key={result.id} data={result} />
                        ))}
                    </PopperWrapper>
                </div>
            )}
        >
            <div className={cx('search')}>
                {/* Search input */}
                <input
                    ref={inputRef}
                    value={searchValue}
                    placeholder="Search accounts and videos"
                    spellCheck={false}
                    onChange={(e) => {
                        setSearchValue(e.target.value);
                    }}
                    onFocus={() => setShowSearchResult(true)}
                />

                {/* Clear search result button */}
                {!!searchValue && !showLoading && (
                    <button className={cx('clear-btn')} onClick={handleClear}>
                        <FontAwesomeIcon icon={faCircleXmark} />
                    </button>
                )}

                {showLoading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />}

                {/*  Search button */}
                <button className={cx('search-btn')}>
                    <SearchIcon />
                </button>
            </div>
        </HeadlessTippy>
    );
}

export default Search;
