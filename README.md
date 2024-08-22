# Visual Cleanup (Twitch/Youtube)
This is a personalized browser extension for Firefox (Chrome untested), that fixes and removes a series of eyesores and "features" that should never have been implemented on the respective sites.

### Cleanups
<!--
<table>
    <tr>
        <td>Site</td>
        <td>Path</td>
        <td>Cleanup</td>
    </tr>
  <tr>
    <td>Twitch</td>
    <td>/directory/following/</td>
    <td>
        - Removal of the "Stories" from the left side navigation bar. <br/>
        - Removal of the large "Stories" banner at the top of the page. <br/>
    </td>
  </tr>
  <tr>
    <td>Youtube</td>
    <td>[/feed/subscriptions](https://www.youtube.com/feed/subscriptions)</td>
    <td>
        - Removal of the "Short" block from both Grid and List view.
    </td>
  </tr>
</table>
-->

| Site	    | Path 	| Cleanup	|   
|---	    |---	|---	|
| Twitch 	| [/directory/following/*](https://www.twitch.com/directory/following)	| - Removal of the "Stories" from the left side navigation bar. <br/> - Removal of the large "Stories" banner at the top of the page. <br/>	|
| Youtube  	| [/feed/subscriptions](https://www.youtube.com/feed/subscriptions)	| - Removal of the "Short" block from both Grid and List view. |


### Extension variants
The extension exists in two variants:

- [Normal](/src/) : An extension using messages from content scripts allowing background service to implement the changes. Allows toggling of the fix/removal using an extension action icon located in the browser url bar.

- [Light](/src-light/) : A lightweight version that only contain a content script & stylesheet for each site.
