import React, { useRef } from "react";
import PartnershipsConfig from "PartnershipsConfig";
import { Dropdown } from "semantic-ui-react";
import Translate from "utils/translate/translateService";
import { Link } from "react-router-dom";
import { withLocaleUrl } from "../../utils/utils";

export default function PartnershipsDropDown() {

  const dropDownItemsRef = useRef([
    // Add more items to this array if we have more partnerships
    generateDropdownItem(PartnershipsConfig[0])
  ])


  return (
    <Dropdown text={Translate("Partnerships")} pointing className="dropdown">
      <Dropdown.Menu>{dropDownItemsRef.current}</Dropdown.Menu>
    </Dropdown>
  );
}

function generateDropdownItem(studyConfig: any) {
  const label = Translate("PartnershipsList", [studyConfig.routeName]);
  return (
    <Dropdown.Item>
      <Link to={withLocaleUrl(`Partnerships/${studyConfig.routeName}`)}>{label}</Link>
    </Dropdown.Item>
  );
}
