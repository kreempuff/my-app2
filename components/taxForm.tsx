import * as React from "react";
import {ChangeEvent, useEffect, useState} from "react";

import styles from '../styles/Home.module.css'
import {
    Box,
    Button, ButtonGroup,
    Container,
    Grid, Input,
    InputLabel,
    MenuItem,
    Select,
    Step,
    StepLabel,
    Stepper, TextField,
    Typography
} from "@material-ui/core";

enum MarriedState {
    Single = "Single",
    MarriedJoint = "Married, filing jointly",
    MarriedSeparately = "Married, filing separately",
    HeadOfHouse = "Head Of Household"
}


const TaxStepComponent: React.FC = (props) => {
    return (
        <div>
            {props.children}
        </div>
    );
}

interface TaxStep {
    label: string
    additionalCondition: boolean
    component: React.ReactNode
}

const TaxForm: React.FC<{
    data: Array<{
        "name": string,
        "abbreviation": string,
        "tax_rate": number
    }>
}> = (props) => {
    const [income, setIncome] = useState<number>(0);
    const [marriedState, setMarriedState] = useState<MarriedState>(MarriedState.Single);
    const [numChildren, setNumChildren] = useState<number>(0);
    const [usState, setUsState] = useState<string>(props.data[0].name);

    const steps: TaxStep[] = [
        {
            label: "Income",
            additionalCondition: true,
            component: (
                <TaxStepComponent>
                    <InputLabel id={"income-label"}>How much do you estimate you&quot;ll make in income in
                        2021?</InputLabel>
                    <TextField aria-valuemin={0} onChange={(e) => setIncome(parseInt(e.target.value, 10))} type="number"
                               value={"$" + income}/>
                </TaxStepComponent>
            )
        },
        {
            label: "Tax Status",
            additionalCondition: true,
            component: (
                <TaxStepComponent>
                    <InputLabel id={"filing-label"}>How will you file your taxes this year?</InputLabel>
                    <br/>
                    <Select name="filing" labelId={"filing-label"}
                            onChange={(e) => setMarriedState(e.target.value as MarriedState)} id="filing"
                            value={marriedState}>
                        <MenuItem value={MarriedState.Single}>{MarriedState.Single}</MenuItem>
                        <MenuItem value={MarriedState.MarriedJoint}>{MarriedState.MarriedJoint}</MenuItem>
                        <MenuItem value={MarriedState.MarriedSeparately}>{MarriedState.MarriedSeparately}</MenuItem>
                        <MenuItem value={MarriedState.HeadOfHouse}>{MarriedState.HeadOfHouse}</MenuItem>
                    </Select>
                </TaxStepComponent>
            )
        },
        {
            label: "Children",
            additionalCondition: marriedState == MarriedState.MarriedJoint || marriedState == MarriedState.MarriedSeparately,
            component: (
                <TaxStepComponent>
                    <InputLabel>Number of children?</InputLabel>
                    <TextField aria-valuemin={0}  type="number" value={numChildren}
                           onChange={(e) => setNumChildren(parseInt(e.target.value) || 0)}/>
                </TaxStepComponent>
            )
        },
        {
            label: "State",
            additionalCondition: true,
            component: (
                <TaxStepComponent>
                    <InputLabel id={"state-label"}>What state do you live in?</InputLabel>
                    <Select labelId={"state-label"} onChange={(e) => setUsState(e.target.value)} name="state" id="state" value={usState}>
                        {props.data.map(d => (
                            <MenuItem key={d.abbreviation} value={d.name}>{d.name}</MenuItem>
                        ))}
                    </Select>
                </TaxStepComponent>
            )
        }
    ]


    const [activeStep, setActiveStep] = useState<number>(steps.findIndex((s) => s.additionalCondition));


    function handleBack() {
        let idx = activeStep - 1
        for (; idx >= 0; idx--) {
            if (steps[idx].additionalCondition) {
                break;
            }
        }
        return setActiveStep(idx)
    }

    function handleForward() {
        let idx = activeStep + 1;
        for (; idx < steps.length; idx++) {
            if (steps[idx].additionalCondition) {
                break;
            }
        }
        return setActiveStep(idx)
    }

    function lookupStatetaxRate(stateInput: string): number {
        const state = props.data.find((d) => d.name === stateInput)
        if (!state) {
            throw new Error("State not found")
        }
        return state.tax_rate
    }

    return (
        <div className={styles.container}>

            <Grid container>
                <Grid item xs={12}>
                    <Stepper activeStep={activeStep}>
                        {steps.map((s) => (<Step active={s.additionalCondition} key={s.label}>
                            <StepLabel>{s.label}</StepLabel>
                        </Step>))}
                    </Stepper>
                </Grid>

                <Grid item container justifyContent={"center"} xs={12}>
                    {activeStep === steps.length ? null : steps[activeStep].component}
                </Grid>
                <Grid container justifyContent={"center"} item sm={12}>
                    <ButtonGroup>
                        <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
                        <Button disabled={activeStep === steps.length} onClick={handleForward}>Continue</Button>
                    </ButtonGroup>
                </Grid>
                <br/>
                <Grid item container justifyContent={"center"} sm={12}>
                    <Typography align={"center"} variant={"h5"}>
                        Tax burden
                    </Typography>
                </Grid>
                <Grid item sm={6} xs={12}>
                    <Typography align={"center"} variant={"h6"}>
                        federal: {((income || 0) * 0.15).toFixed(2)}
                    </Typography>
                </Grid>
                <Grid item sm={6} xs={12}>
                    <Typography align={"center"} variant={"h6"}>
                        state: {((income || 0) * lookupStatetaxRate(usState)).toFixed(2)}
                    </Typography>
                </Grid>
            </Grid>
        </div>
    )
}

export default TaxForm
