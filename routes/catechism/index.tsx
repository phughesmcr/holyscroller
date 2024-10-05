import { Partial } from "$fresh/runtime.ts";
import { TopFade } from "@components/TopFade.tsx";
import Searcher from "@islands/Searcher.tsx";
import { $isLoading } from "@lib/state.ts";
import { useEffect } from "preact/hooks";
import AppContainer from "../../components/AppContainer.tsx";
import Catechism from "../../db/catechism.json" with { type: "json" };
import NavBar from "../../islands/NavBar.tsx";
import Toolbar from "../../islands/Toolbar/Toolbar.tsx";

export default function CatechismHome() {
  useEffect(() => {
    $isLoading.value = false;
  }, []);

  return (
    <AppContainer>
      <main role="main" className="min-w-0 min-h-0 w-full h-full" f-client-nav>
        <Toolbar />
        <TopFade />
        <Searcher />
        <div
          role="feed"
          aria-busy="false"
          className="w-full h-full overflow-y-auto hide-scrollbars touch-pan-y snap-y snap-mandatory p-2"
        >
          <Partial name="carousel" mode="replace">
            <article key={0} className="ui catechism w-full h-full snap-start snap-always">
              <h1>A Catechism</h1>
              <p>
                From the 1662 Book of Common Prayer. <br />
                <br />"An Instruction to be learned of every person before he be brought to be Confirmed by the Bishop"
              </p>
              <small>
                Extracts from The Book of Common Prayer, the rights in which are vested in the Crown, are reproduced by
                permission of the Crown's patentee, Cambridge University Press.
              </small>
            </article>
            {Catechism.map((c, index) => {
              return (
                <article key={index} className="ui catechism w-full h-full snap-start snap-always">
                  <h1>{c[0]}</h1>
                  <p>{c[1]}</p>
                </article>
              );
            })}
          </Partial>
        </div>
      </main>
      <NavBar />
    </AppContainer>
  );
}
