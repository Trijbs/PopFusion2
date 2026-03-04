(() => {
  const content = window.PopFusionContent || {};

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const page = document.body.dataset.page || "";

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function setHtml(selector, html) {
    const element = typeof selector === "string" ? qs(selector) : selector;
    if (element) {
      element.innerHTML = html;
    }
  }

  function formatTagList(tags) {
    return tags
      .map((tag) => `<li class="tag">${escapeHtml(tag)}</li>`)
      .join("");
  }

  function storyList() {
    const featured = content.newsStories?.featured ? [content.newsStories.featured] : [];
    return featured.concat(content.newsStories?.stories || []);
  }

  function getStoryBySlug(slug) {
    return storyList().find((story) => story.slug === slug) || content.newsStories?.featured || null;
  }

  function getArtistBySlug(slug) {
    return (
      (content.featuredArtists || []).find((artist) => artist.slug === slug) ||
      (content.featuredArtists || [])[0] ||
      null
    );
  }

  function queryMatches(haystack, needle) {
    return haystack.toLowerCase().includes(needle.toLowerCase());
  }

  function cardLink(label, href, variant = "text-link") {
    return `<a class="${variant}" href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
  }

  function renderLineupCards(items) {
    return items
      .map(
        (item) => `
          <article class="spot-card spot-card--lineup reveal-ready">
            <div class="spot-card__image">
              <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)} live at PopFusion">
            </div>
            <div class="spot-card__body">
              <p class="eyebrow">${escapeHtml(item.day)} / ${escapeHtml(item.stage)}</p>
              <h3>${escapeHtml(item.name)}</h3>
              <p class="meta-line">${escapeHtml(item.genre)}</p>
              <p>${escapeHtml(item.blurb)}</p>
              ${cardLink("Open artist story", `artist.html?artist=${encodeURIComponent(item.slug)}`)}
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderArtistCards(items) {
    return items
      .map(
        (artist) => `
          <article class="artist-card reveal-ready">
            <div class="artist-card__image">
              <img src="${escapeHtml(artist.image)}" alt="${escapeHtml(artist.name)} portrait">
            </div>
            <div class="artist-card__body">
              <p class="eyebrow">${escapeHtml(artist.genre)} / ${escapeHtml(artist.city)}</p>
              <h3>${escapeHtml(artist.name)}</h3>
              <p>${escapeHtml(artist.note)}</p>
              <dl class="mini-facts">
                <div>
                  <dt>Festival set</dt>
                  <dd>${escapeHtml(artist.festivalSet)}</dd>
                </div>
                <div>
                  <dt>Latest release</dt>
                  <dd>${escapeHtml(artist.latestRelease)}</dd>
                </div>
              </dl>
              ${cardLink("View artist profile", `artist.html?artist=${encodeURIComponent(artist.slug)}`)}
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderStoryCards(items) {
    return items
      .map(
        (story) => `
          <article class="story-card reveal-ready" data-category="${escapeHtml(story.category.toLowerCase())}">
            <div class="story-card__image">
              <img src="${escapeHtml(story.image)}" alt="${escapeHtml(story.title)}">
            </div>
            <div class="story-card__body">
              <p class="eyebrow">${escapeHtml(story.category)} / ${escapeHtml(story.date)}</p>
              <h3>${escapeHtml(story.title)}</h3>
              <p>${escapeHtml(story.dek)}</p>
              ${cardLink("Read article", `article.html?story=${encodeURIComponent(story.slug)}`)}
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderWeeklyList(items) {
    return items
      .map(
        (item) => `
          <article class="weekly-card reveal-ready">
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
            <ul class="tag-list">${formatTagList(item.tags)}</ul>
          </article>
        `
      )
      .join("");
  }

  function renderTravelCards(items) {
    return items
      .map(
        (item) => `
          <article class="info-card reveal-ready">
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
          </article>
        `
      )
      .join("");
  }

  function renderChartRows(items) {
    return items
      .map(
        (item) => `
          <article class="rank-row reveal-ready" data-category="${escapeHtml(item.category)}">
            <div class="rank-row__value">${escapeHtml(item.rank)}</div>
            <div class="rank-row__body">
              <p class="eyebrow">${escapeHtml(item.movement)}</p>
              <h3>${escapeHtml(item.name)}</h3>
              <p>${escapeHtml(item.detail)}</p>
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderFilterButtons(container, items, groupName, activeKey) {
    setHtml(
      container,
      items
        .map((item) => {
          const key = item.key || item;
          const label = item.label || item;
          const isActive = key === activeKey;
          return `
            <button class="filter-chip${isActive ? " is-active" : ""}" type="button" data-filter-group="${escapeHtml(
              groupName
            )}" data-filter-value="${escapeHtml(key)}" aria-pressed="${isActive ? "true" : "false"}">
              ${escapeHtml(label)}
            </button>
          `;
        })
        .join("")
    );
  }

  function setupFilterGroup(groupName, targetSelector, activeValue = "all") {
    const buttons = qsa(`[data-filter-group="${groupName}"]`);
    const targets = qsa(targetSelector);

    function applyFilter(nextValue) {
      buttons.forEach((button) => {
        const isActive = button.dataset.filterValue === nextValue;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });

      targets.forEach((target) => {
        const itemValue = target.dataset.category || target.dataset.genre || "all";
        const visible = nextValue === "all" || itemValue === nextValue;
        target.hidden = !visible;
      });
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => applyFilter(button.dataset.filterValue));
    });

    applyFilter(activeValue);
  }

  function setupHeader() {
    const header = qs("[data-header]");
    const navToggle = qs("[data-nav-toggle]");
    const nav = qs("[data-nav-panel]");

    if (header) {
      const onScroll = () => {
        header.classList.toggle("is-scrolled", window.scrollY > 16);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    qsa("[data-nav-link]").forEach((link) => {
      const isCurrent = link.dataset.navLink === page;
      link.classList.toggle("is-current", isCurrent);
      if (isCurrent) {
        link.setAttribute("aria-current", "page");
      }
    });

    if (navToggle && nav) {
      const closeNav = () => {
        nav.dataset.open = "false";
        navToggle.setAttribute("aria-expanded", "false");
      };

      navToggle.addEventListener("click", () => {
        const nextOpen = nav.dataset.open !== "true";
        nav.dataset.open = nextOpen ? "true" : "false";
        navToggle.setAttribute("aria-expanded", String(nextOpen));
      });

      qsa("[data-nav-link]", nav).forEach((link) => {
        link.addEventListener("click", closeNav);
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeNav();
        }
      });

      window.addEventListener("resize", () => {
        if (window.innerWidth >= 900) {
          closeNav();
        }
      });
    }
  }

  function setupReveals() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = qsa(".reveal, .reveal-ready");

    if (reduceMotion) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -48px 0px" }
    );

    elements.forEach((element) => observer.observe(element));
  }

  function setupSearch() {
    const form = qs("[data-search-form]");
    const feedback = qs("[data-search-feedback]");
    if (!form || !feedback) {
      return;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const field = qs('input[type="search"]', form);
      const rawQuery = field ? field.value.trim().toLowerCase() : "";

      if (!rawQuery) {
        feedback.textContent = "Search artists, genres, or articles to get a quick route through the site.";
        return;
      }

      const artistMatches = (content.featuredArtists || []).filter((artist) =>
        `${artist.name} ${artist.genre} ${artist.city}`.toLowerCase().includes(rawQuery)
      );

      const genreMatches = (content.festival?.genres || []).filter((genre) =>
        `${genre.name} ${genre.description}`.toLowerCase().includes(rawQuery)
      );

      const storyMatches = storyList().filter((story) =>
        `${story.title} ${story.category} ${story.dek}`.toLowerCase().includes(rawQuery)
      );

      const lines = [];
      if (artistMatches[0]) {
        lines.push(
          `Artist match: ${artistMatches[0].name}. Open ${artistMatches[0].name}'s profile from the featured artist section.`
        );
      }
      if (genreMatches[0]) {
        lines.push(`Genre lane: ${genreMatches[0].name}. Check Discover for the full lane.`);
      }
      if (storyMatches[0]) {
        lines.push(`Story match: ${storyMatches[0].title}. Open the latest news section for details.`);
      }

      feedback.textContent = lines[0] || `No direct match for "${rawQuery}". Try artist names, genre names, or festival planning topics.`;
    });
  }

  function setupForms() {
    qsa("[data-newsletter-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const emailField = qs('input[type="email"]', form);
        const feedback = qs(".form-feedback", form);
        const isValid = emailField && emailField.validity.valid;

        if (!feedback) {
          return;
        }

        if (!isValid) {
          feedback.textContent = "Enter a valid email address to receive release notes and festival updates.";
          feedback.dataset.state = "error";
          return;
        }

        feedback.textContent = "Thanks. You are on the PopFusion prototype update list for Summer 2026.";
        feedback.dataset.state = "success";
        form.reset();
      });
    });

    qsa("[data-support-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const feedback = qs(".form-feedback", form);
        const requiredFields = qsa("[required]", form);
        let hasError = false;

        requiredFields.forEach((field) => {
          const fieldWrap = field.closest(".field");
          const errorNode = fieldWrap ? qs(".field-error", fieldWrap) : null;
          const isValid = field.validity.valid;

          if (errorNode) {
            errorNode.textContent = isValid ? "" : "This field is required.";
          }

          if (!isValid) {
            hasError = true;
          }
        });

        if (!feedback) {
          return;
        }

        if (hasError) {
          feedback.textContent = "Please complete the required fields before sending your question.";
          feedback.dataset.state = "error";
          return;
        }

        feedback.textContent = "Message sent. In the prototype, this form represents the support and accessibility inbox.";
        feedback.dataset.state = "success";
        form.reset();
        qsa(".field-error", form).forEach((node) => {
          node.textContent = "";
        });
      });
    });

    qsa("[data-auth-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const feedback = qs(".form-feedback", form);
        const mode = form.dataset.authMode || "login";
        const requiredFields = qsa("[required]", form);
        let hasError = false;

        requiredFields.forEach((field) => {
          const fieldWrap = field.closest(".field");
          const errorNode = fieldWrap ? qs(".field-error", fieldWrap) : null;
          const isValid = field.validity.valid;

          if (errorNode) {
            errorNode.textContent = isValid ? "" : "This field is required.";
          }

          if (!isValid) {
            hasError = true;
          }
        });

        if (!feedback) {
          return;
        }

        if (hasError) {
          feedback.textContent = "Complete the required fields before continuing.";
          feedback.dataset.state = "error";
          return;
        }

        const email = qs('input[name="email"]', form)?.value.trim() || "";
        const password = qs('input[name="password"]', form)?.value || "";
        const name = qs('input[name="name"]', form)?.value.trim() || "";
        const existingUser = JSON.parse(localStorage.getItem("popfusion_user") || "null");

        if (mode === "register") {
          localStorage.setItem(
            "popfusion_user",
            JSON.stringify({
              name,
              email,
              password
            })
          );
          feedback.textContent = "Account created for the prototype. You can now use the sign-in page.";
          feedback.dataset.state = "success";
          form.reset();
          qsa(".field-error", form).forEach((node) => {
            node.textContent = "";
          });
          return;
        }

        if (!existingUser || existingUser.email !== email || existingUser.password !== password) {
          feedback.textContent = "No matching prototype account found. Register first or check your details.";
          feedback.dataset.state = "error";
          return;
        }

        feedback.textContent = `Welcome back, ${existingUser.name || "visitor"}. This prototype now routes you to the home page.`;
        feedback.dataset.state = "success";
        setTimeout(() => {
          window.location.href = "index.html";
        }, 800);
      });
    });
  }

  function setupFaq() {
    qsa(".faq-item").forEach((item) => {
      const button = qs(".faq-question", item);
      if (!button) {
        return;
      }

      button.addEventListener("click", () => {
        const expanded = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!expanded));
        item.classList.toggle("is-open", !expanded);
      });
    });
  }

  function renderHome() {
    setHtml(
      "[data-festival-facts]",
      (content.festival?.facts || [])
        .map(
          (fact) => `
            <div class="signal">
              <strong>${escapeHtml(fact.value)}</strong>
              <span>${escapeHtml(fact.label)}</span>
            </div>
          `
        )
        .join("")
    );

    setHtml("[data-lineup-grid]", renderLineupCards(content.festival?.lineup || []));

    setHtml(
      "[data-genre-lanes]",
      (content.festival?.genres || [])
        .map(
          (genre) => `
            <article class="genre-lane reveal-ready">
              <h3>${escapeHtml(genre.name)}</h3>
              <p>${escapeHtml(genre.description)}</p>
              ${cardLink("Open this lane", "discover.html")}
            </article>
          `
        )
        .join("")
    );

    setHtml("[data-home-news]", renderStoryCards((content.newsStories?.stories || []).slice(0, 3)));
    setHtml(
      "[data-weekend-plans]",
      (content.festival?.weekendPlans || [])
        .map(
          (item) => `
            <article class="info-card reveal-ready">
              <p class="eyebrow">${escapeHtml(item.meta)}</p>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.description)}</p>
            </article>
          `
        )
        .join("")
    );
    setHtml("[data-featured-artists]", renderArtistCards(content.featuredArtists || []));
  }

  function renderDiscover() {
    renderFilterButtons("[data-discover-filters]", content.discoverCollections?.filters || [], "discover", "all");

    setHtml(
      "[data-discover-grid]",
      (content.discoverCollections?.newThisWeek || [])
        .map(
          (item) => `
            <article class="release-card reveal-ready" data-genre="${escapeHtml(item.genre)}">
              <div class="release-card__image">
                <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)} artwork">
              </div>
              <div class="release-card__body">
                <p class="eyebrow">${escapeHtml(item.genre)}</p>
                <h3>${escapeHtml(item.title)}</h3>
                <p class="meta-line">${escapeHtml(item.artist)}</p>
                <p>${escapeHtml(item.blurb)}</p>
              </div>
            </article>
          `
        )
        .join("")
    );

    setHtml("[data-discover-weekly]", renderWeeklyList(content.discoverCollections?.weekly || []));

    setHtml(
      "[data-rising-artists]",
      (content.discoverCollections?.rising || [])
        .map(
          (artist) => `
            <article class="info-card reveal-ready">
              <div class="avatar-row">
                <img class="avatar" src="${escapeHtml(artist.image)}" alt="${escapeHtml(artist.name)}">
                <div>
                  <p class="eyebrow">${escapeHtml(artist.genre)}</p>
                  <h3>${escapeHtml(artist.name)}</h3>
                </div>
              </div>
              <p>${escapeHtml(artist.summary)}</p>
            </article>
          `
        )
        .join("")
    );

    const cta = content.discoverCollections?.cta;
    if (cta) {
      setHtml(
        "[data-discover-cta]",
        `
          <div class="cta-panel reveal-ready">
            <div>
              <p class="eyebrow">Next step</p>
              <h2>${escapeHtml(cta.title)}</h2>
              <p>${escapeHtml(cta.description)}</p>
            </div>
            <div class="cta-panel__actions">
              <a class="button button--primary" href="${escapeHtml(cta.href)}">${escapeHtml(cta.label)}</a>
              <a class="button button--ghost" href="news.html">Read the festival desk</a>
            </div>
          </div>
        `
      );
    }

    setupFilterGroup("discover", "[data-discover-grid] .release-card", "all");
  }

  function renderCharts() {
    renderFilterButtons("[data-chart-filters]", content.chartHighlights?.categories || [], "charts", "artists");
    setHtml("[data-chart-list]", renderChartRows(content.chartHighlights?.rankings || []));

    const spotlight = content.chartHighlights?.spotlight;
    if (spotlight) {
      setHtml(
        "[data-chart-spotlight]",
        `
          <article class="spotlight-panel reveal-ready">
            <p class="eyebrow">${escapeHtml(spotlight.title)}</p>
            <h3>${escapeHtml(spotlight.name)}</h3>
            <p class="meta-line">${escapeHtml(spotlight.descriptor)}</p>
            <p>${escapeHtml(spotlight.summary)}</p>
            <a class="button button--secondary" href="${escapeHtml(spotlight.href)}">${escapeHtml(spotlight.label)}</a>
          </article>
        `
      );
    }

    setupFilterGroup("charts", "[data-chart-list] .rank-row", "artists");
  }

  function renderArtist() {
    const url = new URL(window.location.href);
    const artist = getArtistBySlug(url.searchParams.get("artist"));
    if (!artist) {
      return;
    }

    setHtml(
      "[data-artist-hero]",
      `
        <div class="artist-hero__copy">
          <p class="eyebrow">${escapeHtml(artist.genre)} / ${escapeHtml(artist.city)}</p>
          <h1>${escapeHtml(artist.name)}</h1>
          <p class="hero-lead">${escapeHtml(artist.note)}</p>
          <dl class="mini-facts">
            <div>
              <dt>Festival set</dt>
              <dd>${escapeHtml(artist.festivalSet)}</dd>
            </div>
            <div>
              <dt>Latest release</dt>
              <dd>${escapeHtml(artist.latestRelease)}</dd>
            </div>
          </dl>
        </div>
        <div class="artist-hero__art">
          <img src="${escapeHtml(artist.image)}" alt="${escapeHtml(artist.name)} portrait">
        </div>
      `
    );

    setHtml(
      "[data-track-list]",
      (artist.tracks || [])
        .map(
          (track, index) => `
            <article class="track-row reveal-ready">
              <div class="track-row__number">${index + 1}</div>
              <div class="track-row__body">
                <h3>${escapeHtml(track.title)}</h3>
                <p>${escapeHtml(track.note)}</p>
              </div>
              <span class="track-row__time">${escapeHtml(track.length)}</span>
            </article>
          `
        )
        .join("")
    );

    setHtml(
      "[data-artist-set]",
      `
        <article class="info-card reveal-ready">
          <p class="eyebrow">Upcoming live appearance</p>
          <h3>${escapeHtml(artist.festivalSet)}</h3>
          <p>${escapeHtml(artist.liveBlurb)}</p>
        </article>
      `
    );

    setHtml(
      "[data-artist-about]",
      `
        <article class="rich-panel reveal-ready">
          <p>${escapeHtml(artist.about)}</p>
        </article>
      `
    );

    setHtml(
      "[data-related-artists]",
      renderArtistCards((content.featuredArtists || []).filter((item) => item.slug !== artist.slug).slice(0, 3))
    );

    const relatedStories = storyList().slice(0, 2);
    setHtml("[data-artist-news]", renderStoryCards(relatedStories));
  }

  function renderNews() {
    const featured = content.newsStories?.featured;
    if (featured) {
      setHtml(
        "[data-featured-story]",
        `
          <article class="feature-story reveal-ready">
            <div class="feature-story__image">
              <img src="${escapeHtml(featured.image)}" alt="${escapeHtml(featured.title)}">
            </div>
            <div class="feature-story__body">
              <p class="eyebrow">${escapeHtml(featured.category)} / ${escapeHtml(featured.date)}</p>
              <h2>${escapeHtml(featured.title)}</h2>
              <p class="hero-lead">${escapeHtml(featured.dek)}</p>
              <p class="meta-line">By ${escapeHtml(featured.author)}</p>
              <a class="button button--primary" href="article.html?story=${escapeHtml(featured.slug)}">Read the lead story</a>
            </div>
          </article>
        `
      );
    }

    setHtml(
      "[data-trending-topics]",
      (content.newsStories?.topics || [])
        .map((topic) => `<li class="topic-pill">${escapeHtml(topic)}</li>`)
        .join("")
    );

    const categories = ["all"].concat(
      Array.from(new Set((content.newsStories?.stories || []).map((story) => story.category.toLowerCase())))
    );
    renderFilterButtons("[data-news-filters]", categories, "news", "all");
    setHtml("[data-news-grid]", renderStoryCards(content.newsStories?.stories || []));
    setupFilterGroup("news", "[data-news-grid] .story-card", "all");
  }

  function renderArticle() {
    const url = new URL(window.location.href);
    const slug = url.searchParams.get("story") || content.newsStories?.article?.defaultSlug;
    const story = getStoryBySlug(slug);
    if (!story) {
      return;
    }

    document.title = `${story.title} - ${content.siteMeta?.name || "PopFusion"}`;
    setHtml(
      "[data-article-breadcrumb]",
      `
        <a href="news.html">News</a>
        <span>/</span>
        <span>${escapeHtml(story.category)}</span>
      `
    );

    setHtml(
      "[data-article-hero]",
      `
        <p class="eyebrow">${escapeHtml(story.category)} / ${escapeHtml(story.date)}</p>
        <h1>${escapeHtml(story.title)}</h1>
        <p class="hero-lead">${escapeHtml(story.dek)}</p>
        <p class="meta-line">By ${escapeHtml(story.author)}</p>
        <img class="article-hero__image" src="${escapeHtml(story.image)}" alt="${escapeHtml(story.title)}">
      `
    );

    setHtml(
      "[data-article-body]",
      (story.body || [])
        .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
        .join("")
    );

    const relatedStories = storyList()
      .filter((item) => item.slug !== story.slug)
      .slice(0, 3);
    setHtml("[data-article-related]", renderStoryCards(relatedStories));
  }

  function renderVisit() {
    const visit = content.visitInfo || {};
    setHtml("[data-visit-travel]", renderTravelCards(visit.travel || []));
    setHtml("[data-visit-essentials]", renderTravelCards(visit.essentials || []));
    setHtml("[data-visit-accessibility]", renderTravelCards(visit.accessibility || []));

    setHtml(
      "[data-visit-support]",
      `
        <article class="rich-panel reveal-ready">
          <p class="eyebrow">Support inbox</p>
          <h3>${escapeHtml(visit.support?.email || "")}</h3>
          <p>${escapeHtml(visit.support?.description || "")}</p>
        </article>
      `
    );

    if (visit.app) {
      setHtml(
        "[data-visit-app]",
        `
          <div class="cta-panel reveal-ready">
            <div>
              <p class="eyebrow">Festival app concept</p>
              <h2>${escapeHtml(visit.app.title)}</h2>
              <p>${escapeHtml(visit.app.description)}</p>
            </div>
            <div class="cta-panel__actions">
              ${visit.app.ctas
                .map(
                  (cta, index) =>
                    `<a class="button ${index === 0 ? "button--primary" : "button--ghost"}" href="${escapeHtml(
                      cta.href
                    )}">${escapeHtml(cta.label)}</a>`
                )
                .join("")}
            </div>
          </div>
        `
      );
    }

    setHtml(
      "[data-faq-list]",
      (content.faq || [])
        .map(
          (item, index) => `
            <article class="faq-item reveal-ready">
              <button class="faq-question" type="button" aria-expanded="false" aria-controls="faq-answer-${index}">
                <span>${escapeHtml(item.question)}</span>
                <span class="faq-symbol" aria-hidden="true">+</span>
              </button>
              <div class="faq-answer" id="faq-answer-${index}">
                <p>${escapeHtml(item.answer)}</p>
              </div>
            </article>
          `
        )
        .join("")
    );

  }

  function renderSearchResults() {
    const url = new URL(window.location.href);
    const query = (url.searchParams.get("q") || "").trim();
    const queryLower = query.toLowerCase();
    const results = [];

    if (queryLower) {
      (content.featuredArtists || []).forEach((artist) => {
        if (queryMatches(`${artist.name} ${artist.genre} ${artist.city} ${artist.note}`, queryLower)) {
          results.push({
            type: "Artist",
            title: artist.name,
            description: artist.note,
            href: `artist.html?artist=${encodeURIComponent(artist.slug)}`
          });
        }
      });

      (content.festival?.genres || []).forEach((genre) => {
        if (queryMatches(`${genre.name} ${genre.description}`, queryLower)) {
          results.push({
            type: "Genre lane",
            title: genre.name,
            description: genre.description,
            href: "discover.html"
          });
        }
      });

      storyList().forEach((story) => {
        if (queryMatches(`${story.title} ${story.category} ${story.dek}`, queryLower)) {
          results.push({
            type: "Article",
            title: story.title,
            description: story.dek,
            href: `article.html?story=${encodeURIComponent(story.slug)}`
          });
        }
      });

      (content.discoverCollections?.newThisWeek || []).forEach((item) => {
        if (queryMatches(`${item.title} ${item.artist} ${item.genre} ${item.blurb}`, queryLower)) {
          results.push({
            type: "Release",
            title: `${item.title} / ${item.artist}`,
            description: item.blurb,
            href: "discover.html#new-this-week"
          });
        }
      });
    }

    const header = qs("[data-search-results-header]");
    if (header) {
      if (query) {
        header.innerHTML = `<p class="eyebrow">Search results</p><h1>Results for "${escapeHtml(
          query
        )}"</h1><p class="hero-lead">${results.length} result${results.length === 1 ? "" : "s"} across artists, genres, stories, and releases.</p>`;
      } else {
        header.innerHTML =
          '<p class="eyebrow">Search results</p><h1>Search artists, genres, and articles.</h1><p class="hero-lead">Start with one name, one genre, or one planning topic.</p>';
      }
    }

    setHtml(
      "[data-search-results-list]",
      results.length
        ? results
            .map(
              (item) => `
                <article class="info-card reveal-ready">
                  <p class="eyebrow">${escapeHtml(item.type)}</p>
                  <h3>${escapeHtml(item.title)}</h3>
                  <p>${escapeHtml(item.description)}</p>
                  <a class="text-link" href="${escapeHtml(item.href)}">Open result</a>
                </article>
              `
            )
            .join("")
        : `
          <article class="rich-panel reveal-ready">
            <h3>No direct matches yet.</h3>
            <p>Try artist names like Luna Arcs, genre terms like electronic or pop, or planning topics like travel and accessibility.</p>
            <div class="button-row">
              <a class="button button--primary" href="discover.html">Browse discovery</a>
              <a class="button button--ghost" href="news.html">Read the news desk</a>
            </div>
          </article>
        `
    );
  }

  function initPage() {
    if (page === "home") {
      renderHome();
    }
    if (page === "discover") {
      renderDiscover();
    }
    if (page === "charts") {
      renderCharts();
    }
    if (page === "artist") {
      renderArtist();
    }
    if (page === "news") {
      renderNews();
    }
    if (page === "article") {
      renderArticle();
    }
    if (page === "visit") {
      renderVisit();
    }
    if (page === "search") {
      renderSearchResults();
    }

    qsa("[data-current-year]").forEach((node) => {
      node.textContent = String(new Date().getFullYear());
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupHeader();
    initPage();
    setupFaq();
    setupSearch();
    setupForms();
    setupReveals();
  });
})();
