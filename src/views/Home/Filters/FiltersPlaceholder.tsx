import { Fragment, memo } from "react";
import { Placeholder } from "react-bootstrap";
import randomNumberInterval from "../../../utils/randomNumberInterval";
import { Category, Tag } from "./FiltersComponets";

function FiltersPlaceholder() {
  return (
    <Fragment>
      {new Array(3).fill(0).map((_, i) => {
        const items = [];
        const numberItems = randomNumberInterval(3, 5);
        for (let i = 0; i < numberItems; i++)
          items.push(<Placeholder key={i} xs={randomNumberInterval(7, 9)} bg="secondary" />);

        return (
          <Fragment key={i}>
            <Placeholder key={"title"} as={Category} animation="glow">
              <Placeholder xs={randomNumberInterval(7, 9)} />
            </Placeholder>
            <Placeholder as={Tag} animation="glow">
              {items}
            </Placeholder>
          </Fragment>
        );
      })}
    </Fragment>
  );
}

export default memo(FiltersPlaceholder);
