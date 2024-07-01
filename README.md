# CSSNumerizer

## What is it?
<p>
    This is library designed to make css selectors more generalizeable. For example suppose we have the following 
    css selector:</p>


<p algin = center>
        #target > div > div.sc-hRmvpr.dSYEIN > div.sc-cZBZkQ.fudfIh > div > div > span > button:nth-child(1) > img
</p>
    This library will aim to transform this into something like this:

        #target > div > div:nth-child(2)> div:nth-child(4) > div > div > span > button:nth-child(1) > img

    The main difference is that it will aim to get rid of class names in the css selector, and instead opt 
    for something like this, where it uses "nth-child" notation in place. We call this process enumizering the
    css Selector. Hence the name CSSNumerizer.

## Use case
    Suppose that we are trying to do simulate a click event on a website using something like puppeteer.js. To do this
    we need the css selector of the html element we want to click say for example this:

        #root > div.asd-1234xs > div.3d12 > button

    Note that this css selector relies on class names, but what if those class names change the next time we scrape that
    website. Then the code will fail!!!. If instead we enumerate the selector like so:

        #root > div:nth-child({#1}) > div:nth-child(#2) > button

    where #1 and #2 are some integer number, then, as long as the structure of the html does not change, the puppeteer code will work even if the css class names are different.  

## GOALS
    - This is project is desinged be as light weight as possible
    - Minimal dependencies
    - Reasonably fast 
    - Easy to use API
    
