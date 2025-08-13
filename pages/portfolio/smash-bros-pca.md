## Unsupervised Categorization of Smash Ultimate Characters via Matchup Data

<img src="/images/wolf_taunt.avif" alt="Wolf Taunt" />

In my Junior year of high school, I was introduced to competitive Smash Ultimate. After getting out of the casual realm of Kirby down-B spam and Electroshock arm where basically all players start, I began to notice just how deep and nuanced the game really is. Each character has a unique toolkit, and the way players talk about "matchups" and "playstyles" is well thought out and hyper-analyzed. The game is just so complex and there are so many interactions among the nearly 8,000 character matchups that every game can feel unique. 

The first character I used as my main was Wolf. Back then he was known as an easy-to-play S-tier character who also served as a good introduction character to high-level-play. To this day, Wolf is one of my favorite characters to play and I still have great success with him at tournaments. However, the playstyle I learned with Wolf was very weak to one of the most popular characters played by my high school peers, Bowser. 

Bowser's "Tough Guy" mechanic allows him to soak up weaker attacks without flinching. And unfortunately, my bread and butter as Wolf was a combo-starter move that could easily be sucked up by Tough Guy. This put me in an extremely disadvantagous position against anybody playing Bowser. Eventually, I was so fed up by this that I mastered a whole new character just to deal with this matchup. And so I began to play Palutena. 

However, I soon realized that both Palutena and Wolf were both quite weak against Mr. Game and Watch, another popular character among my peers and one of the strongest in the game. To counter this disadvantageous matchup, I learned to play Byleth to cover the weaknesses of my roster. BUT THEN, the atrocious monstrosity that is Steve was added to the cast who was able to counter all three of my characters! 

Can you see where this is going? 

Smash Bros is just that kind of game. And that has simultaneously been one of my favorite and one of my least favorite aspects of the game. I love how it feels different and unique to play each matchup, but I hate that my entire roster can be full-countered by a gameplay quirk unique to a single character. 

That's what gave me the idea for this project. This concept of matchup analysis is one that has been torn apart by the community. Below I've attached what is known as a matchup chart which places each character in the cast in a level depending on how easy or difficult their matchup against my characters. 

From left to right, we have Wolf, Palutena, then Byleth

<div style="display: flex; gap: 16px; justify-content: center; align-items: flex-start;">
  <img src="/images/wolf_chart.webp" alt="Wolf Character Analysis Chart" style="min-width: 200px; flex: 1 1 0; max-width: 100%; height: auto;" />
  <img src="/images/palutena_chart.webp" alt="Palutena Character Analysis Chart" style="min-width: 200px; flex: 1 1 0; max-width: 100%; height: auto;" />
  <img src="/images/byleth_chart.jpg" alt="Byleth Character Analysis Chart" style="min-width: 200px; flex: 1 1 0; max-width: 100%; height: auto;" />
</div>

While these are higher level matchup charts and should be expected to differ from my amateur experience, we can see some of the trends that I experienced in my gameplay. For instance, Steve is listed as a difficult matchup for all three of them while Mr. Game and Watch is marked as one of Byleth's relative easier matchups. 

My hypothesis was simple: analyzing these matchup charts as data points for each character would yield natural clustering. This clustering could help determine which characters are too similar to each other in critical matchups and which cover each other's weaknesses.

First I would need data. This posed some problems. 

There is no standard format for these mathchup charts. Everyone labels their tiers differently. I decided that in order to simplify I would parse each matchup into a numerical format where favorable matchups would be positive numbers and unfavorable ones would be negative numbers. 

Initially, I went straight to manual annotation purgatory and began digitizing the information found on <a href="https://www.reddit.com/r/smashbros/comments/1j0o2r5/ultimate_matchup_chart_compilation_v13/">This reddit post</a>. That was a mistake. I had to deal with every pro's different labeling scheme, not to mention that some of the links on the list no longer functioned. So I set out to see if my work had already been done for me. 

After some research I found <a href="https://www.reddit.com/r/smashbros/comments/1dns7t0/smash_ultimate_full_matchup_chart/">This dataset</a> generated using community-voted matchup information. While this is not the most accurate source, it certainly provides enough data for this experiment. 

To start, I did a <a href="https://www.ibm.com/think/topics/principal-component-analysis">PCA</a> on the matchup data in order to visualize what we were working with. 

<img src="/images/pca_characters.png">

Immediately I see the red flag that a whopping 65.7% of the variance is explained along a single axis. That is far far too high for the problem we're facing. Our data should be much noisier than that. I realized pretty quickly that this axis was strongly correlated with character strength. That means we only really have one useful axis on which to see the natural clustering. However, this problem can be solved by some simple normalization, basically rescaling each character's machup data from positive and negative numbers representing positive and negative matchups to a 0-1 scale where 0 is their worst matchup and 1 is their best. This should fix the problem. The resulting plot looks like this: 

<img src="/images/analysis_ssbu.png">

Now we're getting somewhere! I've marked some emerging clusters that I noticed. The red are speedy combo characters, the green are projectile zoner characters who don't favor approaching, and the blue characters are spacers who use tools such as large sword swings to put some distance between them and their opponents. I'm sure someone with a better knowledge of the game could find better clusters or poke holes in my simple descriptions of the results, but this is certainly promising. 

One thing that I do need to point out is that there is once again a major dispairity between the amount of variance explained by each axis, albeit on a smaller scale. However, it's not immediately obvious what that axis describes. So I looked at the matchups most influential to this principal component. And honestly, I was amazed at what I saw. 

<table>
  <thead>
    <tr>
      <th style="text-align:center; width:60px;">Rank</th>
      <th style="text-align:left; width:220px;">Character</th>
      <th style="text-align:center; width:110px;">Contribution</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="text-align:center;">1</td><td>Toon Link</td><td style="text-align:center;">+0.1550</td></tr>
    <tr><td style="text-align:center;">2</td><td>Link</td><td style="text-align:center;">+0.1529</td></tr>
    <tr><td style="text-align:center;">3</td><td>Banjo &amp; Kazooie</td><td style="text-align:center;">+0.1485</td></tr>
    <tr><td style="text-align:center;">4</td><td>Bowser Jr.</td><td style="text-align:center;">+0.1418</td></tr>
    <tr><td style="text-align:center;">5</td><td>Zelda</td><td style="text-align:center;">+0.1405</td></tr>
    <tr><td style="text-align:center;">6</td><td>Young Link</td><td style="text-align:center;">+0.1377</td></tr>
    <tr><td style="text-align:center;">7</td><td>King Dedede</td><td style="text-align:center;">+0.1363</td></tr>
    <tr><td style="text-align:center;">8</td><td>Robin</td><td style="text-align:center;">+0.1351</td></tr>
    <tr><td style="text-align:center;">9</td><td>Greninja</td><td style="text-align:center;">+0.1347</td></tr>
    <tr><td style="text-align:center;">10</td><td>King K. Rool</td><td style="text-align:center;">+0.1341</td></tr>
    <tr><td style="text-align:center;">11</td><td>Simon</td><td style="text-align:center;">+0.1329</td></tr>
  </tbody>
</table>
<br>

With the possible exception of Greninja and possibly King Dedede, every single one of these characters are difficult to approach due to space controlling projectiles. This is absolutely one of the most important thing to determining the differences between characters. In order to counter projectile charaacters like these, you need air speed, one of the most important character traits in Smash Ultimate. 

On the other hand, the second Principal Component didn't come up with such an obvious distinction. Here are the top contributors to the second principal component:

<table>
  <thead>
    <tr>
      <th style="text-align:center; width:60px;">Rank</th>
      <th style="text-align:left; width:220px;">Character</th>
      <th style="text-align:center; width:110px;">Contribution</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="text-align:center;">1</td><td>Mario</td><td style="text-align:center;">+0.2443</td></tr>
    <tr><td style="text-align:center;">2</td><td>Ness</td><td style="text-align:center;">+0.2314</td></tr>
    <tr><td style="text-align:center;">3</td><td>Mr. Game &amp; Watch</td><td style="text-align:center;">+0.2217</td></tr>
    <tr><td style="text-align:center;">4</td><td>Dr. Mario</td><td style="text-align:center;">+0.2181</td></tr>
    <tr><td style="text-align:center;">5</td><td>Kirby</td><td style="text-align:center;">+0.2105</td></tr>
    <tr><td style="text-align:center;">6</td><td>Diddy Kong</td><td style="text-align:center;">-0.1906</td></tr>
    <tr><td style="text-align:center;">7</td><td>Ice Climbers</td><td style="text-align:center;">+0.1900</td></tr>
    <tr><td style="text-align:center;">8</td><td>Rosalina &amp; Luma</td><td style="text-align:center;">+0.1876</td></tr>
    <tr><td style="text-align:center;">9</td><td>Min-Min</td><td style="text-align:center;">-0.1873</td></tr>
    <tr><td style="text-align:center;">10</td><td>Shiek</td><td style="text-align:center;">-0.1826</td></tr>
    <tr><td style="text-align:center;">11</td><td>Pyra/Mythra</td><td style="text-align:center;">-0.1814</td></tr>
  </tbody>
</table>

<br>


While there are quite a few more combo-characters in here, we also have wildcards such as Rosalina & Luma, Min-Min, and Dr. Mario. So either this Principal Component is on a higher plane of thought and has realized something my feable mortal brain cannot fathom, or it's just a throwaway. I'm leaning more towards the latter since it only explains 7% of the variance. 

By analyzing matchup data exclusively we haven't found the natural clustering we were looking for at the start, but we do have a very promising start as the analysis identified mobility as one of the most decisive factors to a character's archetype. There is certainly a lot more work that can be done here. I've seen <a href="https://github.com/gaistou/smash_ultimate_stats">some work done by others</a> trying to do exactly what I'm trying to do while working with distinct data from my own. So I'm excited to try new things and see if I can build upon the research I've found with my own contributions. 

So for the time being, I'll revert from a data science to a gamer and try and solve my matchup problem by ... <span style="background-color: #111; color: #111; border-radius: 4px; padding: 2px 8px; cursor: pointer;" onclick="this.style.color='#fff'; this.style.backgroundColor='#222'; this.style.transition='color 0.2s, background 0.2s'; this.innerText='Begging for balance changes. PLEASE NERF STEVE'">Begging for balance changes. PLEASE NERF STEVE</span>

You can find all my code for this project in <a href="https://github.com/andrewjdarley/SSBU-matchup-analysis">This repository</a>!