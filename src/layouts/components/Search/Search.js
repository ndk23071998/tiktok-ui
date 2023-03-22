import { useEffect, useState, useRef } from 'react';
import HeadlessTippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';

import * as searchService from '~/services/search';
import { SearchIcon } from '~/components/Icons';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import AccountItem from '~/components/AccountItem';
import styles from './Search.module.scss';
import { useDebounce } from '~/myHooks';

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

            const result = await searchService.search(debouncedSearchValue);
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

    const handleChange = (e) => {
        const searchKeyword = e.target.value;

        if (!searchKeyword.startsWith(' ')) {
            setSearchValue(e.target.value);
        }
    };

    return (
        // Using a wrapper <div> tag around the reference element solves
        // this by creating a new parentNode context.
        <div>
            <HeadlessTippy
                interactive
                visible={showSearchResult && searchResult && searchResult.length > 0}
                onClickOutside={handleHideSearchResult}
                render={(attrs) => (
                    <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                        <PopperWrapper>
                            <h4 className={cx('search-title')}>Accounts</h4>
                            {searchResult &&
                                searchResult.map((result) => <AccountItem key={result.id} data={result} />)}
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
                        onChange={handleChange}
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
                    <button className={cx('search-btn')} onMouseDown={(e) => e.preventDefault()}>
                        <SearchIcon />
                    </button>
                </div>
            </HeadlessTippy>
        </div>
    );
}

export default Search;
